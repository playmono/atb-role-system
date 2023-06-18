import { Columns, Rows } from "../Prefabs/Enums";
import Hero from "../Prefabs/Characters/Ally";
import Enemy from "../Prefabs/Characters/Enemy";
import Utilities from "../Utilities";
import Experience from "../Prefabs/Experience";
import GameServer from "../Prefabs/GameServer";
import Trail from "../Prefabs/Trail";
import Skill from "../Prefabs/Skill";
import { RolesMap, SkillsMap } from "../Prefabs/Constants";
import Lobby from "./Lobby";

export default class Battlefield extends Phaser.Scene {
    static Name = "Battlefield";
    static allyGroup: Phaser.GameObjects.Group;
    static enemyGroup: Phaser.GameObjects.Group;
    static turnElements: Phaser.GameObjects.Group;
    static experience: Experience;
    public battlefieldIsReady = false;
    public trail: Trail;
    public enemyTrail: Trail;
    private gameIsOver = false;

    public preload(): void {
        this.loadSfx();
        this.loadOtherAnimations();
        this.loadNoviceAnimations();
        this.loadArcherAnimations();
        this.loadBlackMageAnimations();
        this.loadSwordmanAnimations();
        this.loadWhiteMageAnimations();
    }

    public update(): void {
        this.trail.keepTrail();
        this.enemyTrail.keepTrail();
    }

    public create(): void {
        Utilities.LogSceneMethodEntry("Battlefield", "create");
        const gameServer = new GameServer();
        this.trail = new Trail(this, 0x00FFFF, 1);
        this.enemyTrail = new Trail(this, 0xFF0000, 0.5);

        gameServer.gameConnection.on('close', () => {
            this.checkGameOver(true);
        });

        gameServer.gameConnection.on('data', (data: any) => {
            console.log('Received on battlefield', data);
            if (data.type === 'battlefieldLoaded') {
                this.loadHeros();
            }
            if (data.type === 'enemySetup') {
                this.setEnemySetup(data.data);
            }
            if (data.type === 'characterReceivedSkill') {
                this.characterReceivedSkill(data.data);
            }
            if (data.type === 'enemyStatus') {
                this.enemyStatusChanged(data.data);
            }
        });

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
            this.trail.createPoints(dragX, dragY);
        });

        this.input.on('dragend',  (pointer, gameObject, dragX, dragY) => {
            gameObject.x = gameObject.__initialX;
            gameObject.y = gameObject.__initialY;
            this.trail.stopTrail();
        });

        // Enemy Info
        this.add.text(
            this.cameras.main.centerX,
            20,
            `${gameServer.getOppositeGamePlayer().player.username} (${gameServer.getOppositeGamePlayer().player.rating})`,
            { color: '#ed4b00', align: 'right' }
        )
        .setOrigin(0.5);

         // User Info
         this.add.text(
             this.cameras.main.centerX,
             this.cameras.main.height - 20,
             `${gameServer.player.username} (${gameServer.player.rating})`,
             { color: '#00a6ed', align: 'right' }
         )
         .setOrigin(0.5);

        Battlefield.enemyGroup = this.physics.add.group();
        Battlefield.allyGroup = this.physics.add.group();
        Battlefield.turnElements = this.physics.add.group();

        const experienceField = new Phaser.Geom.Rectangle(
            20,
            this.cameras.main.centerY - 100,
            this.cameras.main.width - 50,
            100
        );
        //this.add.graphics({ lineStyle: { color: 0x00ff00 } }).strokeRectShape(experienceField);

        Battlefield.experience = new Experience(experienceField);
        Battlefield.experience.render(this);

        gameServer.gameConnection.send({
            type: 'battlefieldLoaded',
        });

        if (this.battlefieldIsReady) {
            this.loadHeros();
        }
    }

    public loadHeros(): void {
        const gameServer = new GameServer();

        const hero1 = new Hero(Math.random())
        hero1.render(this, Columns.FIRST_COLUMN);
        Battlefield.allyGroup.add(hero1.sprite);

        const hero2 = new Hero(Math.random());
        hero2.render(this, Columns.SECOND_COLUMN);
        Battlefield.allyGroup.add(hero2.sprite);

        const hero3 = new Hero(Math.random());
        hero3.render(this, Columns.THIRD_COLUMN);
        Battlefield.allyGroup.add(hero3.sprite);

        gameServer.gameConnection.send({
            type: 'enemySetup',
            data: [
                {
                    gender: hero1.gender,
                    column: hero1.column,
                },
                {
                    gender: hero2.gender,
                    column: hero2.column,
                },
                {
                    gender: hero3.gender,
                    column: hero3.column
                }
            ]
        });
    }

    public checkGameOver(forceVictory: boolean): void {
        if (this.gameIsOver) {
            return;
        }

        const foundAlly = Battlefield.allyGroup.children.getArray().find((c: any) => c.__parentClass.healthCurrent > 0);
        const foundEnemy = Battlefield.enemyGroup.children.getArray().find((c: any) => c.__parentClass.healthCurrent > 0);

        if (foundAlly && foundEnemy && !forceVictory) {
            return;
        }

        this.gameIsOver = true;

        const gameServer = new GameServer();

        Battlefield.turnElements.clear(true, true);
        Battlefield.enemyGroup.children.getArray().forEach((gameObject: any) => {
            gameObject.__parentClass.atbBar.stop();
        });
        Battlefield.allyGroup.children.getArray().forEach((gameObject: any) => {
            gameObject.__parentClass.atbBar.stop();
            gameObject.__parentClass.turnElements.clear(true, true);
        });
        Battlefield.experience.deactivate();
        Battlefield.experience.stop();

        const gameWon = !foundEnemy || forceVictory;

        const gameOverText = gameWon ?
            'Victory' :
            'Defeat'

        const text = this.add.text(
            this.cameras.main.width + 100,
            this.cameras.main.centerY - 75,
            gameOverText,
            {fontSize: "32px", color: 'white'}
        );
        text.setOrigin(0.5);

        this.tweens.add({
            targets: text,
            x: this.cameras.main.centerX
        });

        const exitButton = this.add.image(-100, this.cameras.main.centerY, 'exit_button');
        exitButton.setInteractive();
        exitButton.scale = 0.25;
        exitButton.setOrigin(0.5);

        const textError = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 30,
            '',
            {fontSize: "16px", color: 'white'}
        );
        textError.setOrigin(0.5);

        exitButton.on("pointerdown", async() => {
            await gameServer.sendGameResult(
                gameWon,
                () => {
                    textError.destroy();
                    this.endBattlefield();
                },
                () => {
                    textError.setText('Error. Try again');
                }
            );
        }, this);

        this.tweens.add({
            targets: exitButton,
            x: this.cameras.main.centerX,
            onComplete: () => {
                const pointsText = this.add.text(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY - 40,
                    !gameWon ? '-50p' : '+50p',
                    {fontSize: "14px", color: !gameWon ? 'red' : 'green'}
                );
                pointsText.setOrigin(0.5);
            }
        });
    }

    private setEnemySetup(data: any): void {
        data.forEach((enemyData: any) => {
            const enemy = new Enemy(enemyData.gender);
            enemy.render(this, enemyData.column);
            Battlefield.enemyGroup.add(enemy.sprite);
        });
    }

    private characterReceivedSkill(data: any): void {
        let to = null;
        if (data.characterType === 'enemy') {
            to = Battlefield.allyGroup.children.getArray().find((c: any) => c.__parentClass.column === data.to);
        } else  {
            to = Battlefield.enemyGroup.children.getArray().find((c: any) => c.__parentClass.column === data.to);
        }

        const from = Battlefield.enemyGroup.children.getArray().find((c: any) => c.__parentClass.column === data.from) as any;

        if (to) {
            const anim = from.play(`${from.__parentClass.getBaseAnimation()}_attacking`);
            anim.on(
                Phaser.Animations.Events.ANIMATION_COMPLETE,
                () => from.play(`${from.__parentClass.getBaseAnimation()}_idle`),
                this
            );

            const skillType = SkillsMap[data.skillType];
            const skill = new skillType();
            const sprite = skill.renderIcon(this, from.x, from.y, skillType);
            sprite.setAlpha(0.7);
            const mask = sprite.mask as any;

            const initialScale = skill.sprite.scale;

            this.tweens.chain({
                targets: skill.sprite,
                tweens: [
                    {
                        x: this.cameras.main.centerX,
                        y: this.cameras.main.centerY - 50,
                        duration: 100,
                        ease: 'Cubic.out',
                        onUpdate: () => {
                            mask.geometryMask.clear();
                            mask.geometryMask.fillCircle(sprite.x, sprite.y, Skill.initialValues.radius);
                            this.enemyTrail.createPoints(sprite.x, sprite.y);
                        }
                    },
                    {
                        scaleX: 0.25,
                        scaleY: 0.25,
                        duration: 200,
                        onUpdate: () => {
                            mask.geometryMask.fillCircle(sprite.x, sprite.y, Skill.dragValues.radius);
                        }
                    },
                    {
                        scaleX: initialScale,
                        scaleY: initialScale,
                        duration: 200,
                        onUpdate: () => {
                            mask.geometryMask.fillCircle(sprite.x, sprite.y, Skill.initialValues.radius);
                        }
                    },
                    {
                        x: to.x,
                        y: to.y,
                        duration: 100,
                        ease: 'Cubic.in',
                        onUpdate: () => {
                            mask.geometryMask.clear();
                            mask.geometryMask.fillCircle(sprite.x, sprite.y, Skill.initialValues.radius);
                            this.enemyTrail.createPoints(sprite.x, sprite.y);
                        },
                        onComplete: () => {
                            to.__parentClass.receiveSkill(skillType.damage);
                            sprite.destroy();
                            mask.destroy();
                        }
                    }
                ]
            });
        }
    }

    private enemyStatusChanged(data): void {
        const from = Battlefield.enemyGroup.children.getArray().find((c: any) => c.__parentClass.column === data.from) as any;

        if (from) {
            from.__parentClass.currentRole.destroy();
            if (data.level) {
                from.__parentClass.currentRole.level = data.level;
            }
            if (data.role) {
                const roleType = RolesMap[data.role];
                if (roleType) {
                    from.__parentClass.setRole(roleType);
                }
            }
            from.__parentClass.renderRole(this);
        }
    }

    private endBattlefield(): void {
        const gameServer = new GameServer();
        gameServer.endGame();
        this.gameIsOver = false;
        this.battlefieldIsReady = false;
        this.scene.start(Lobby.Name);
    }

    private loadSfx(): void {
        this.sound.add('changerole');
    }

    private loadOtherAnimations(): void {
        this.anims.create({
            key: 'radar',
            frames: this.anims.generateFrameNames('radar', {
                start: 0,
                end: 12,
                zeroPad: 2,
                prefix: '',
                suffix: '.png'
            }),
            frameRate: 36,
            repeat: 0
        });
    }

    private loadNoviceAnimations(): void {
        this.anims.create({
            key: 'novice_boy_idle',
            frames: this.anims.generateFrameNames('novice_boy_idle', {
                start: 0,
                end: 17,
                zeroPad: 3,
                prefix: 'Idle Blinking_',
                suffix: '.png'
            }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'novice_boy_hurt',
            frames: this.anims.generateFrameNames('novice_boy_hurt', {
                start: 0,
                end: 11,
                zeroPad: 3,
                prefix: 'Hurt_',
                suffix: '.png'
            }),
            frameRate: 24,
        });

        this.anims.create({
            key: 'novice_boy_attacking',
            frames: this.anims.generateFrameNames('novice_boy_attacking', {
                start: 0,
                end: 11,
                zeroPad: 3,
                prefix: 'Slashing_',
                suffix: '.png'
            }),
            frameRate: 24,
        });

        this.anims.create({
            key: 'novice_boy_dead',
            frames: this.anims.generateFrameNames('novice_boy_dead', {
                start: 0,
                end: 14,
                zeroPad: 3,
                prefix: 'Dying_',
                suffix: '.png'
            }),
            frameRate: 24,
        });

        this.anims.create({
            key: 'novice_girl_idle',
            frames: this.anims.generateFrameNames('novice_girl_idle', {
                start: 0,
                end: 17,
                zeroPad: 3,
                prefix: 'Idle Blinking_',
                suffix: '.png'
            }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'novice_girl_hurt',
            frames: this.anims.generateFrameNames('novice_girl_hurt', {
                start: 0,
                end: 11,
                zeroPad: 3,
                prefix: 'Hurt_',
                suffix: '.png'
            }),
            frameRate: 24,
        });

        this.anims.create({
            key: 'novice_girl_attacking',
            frames: this.anims.generateFrameNames('novice_girl_attacking', {
                start: 0,
                end: 11,
                zeroPad: 3,
                prefix: 'Slashing_',
                suffix: '.png'
            }),
            frameRate: 24,
        });

        this.anims.create({
            key: 'novice_girl_dead',
            frames: this.anims.generateFrameNames('novice_girl_dead', {
                start: 0,
                end: 14,
                zeroPad: 3,
                prefix: 'Dying_',
                suffix: '.png'
            }),
            frameRate: 24,
        });
    }

    private loadArcherAnimations(): void {
        this.anims.create({
            key: 'archer_idle',
            frames: this.anims.generateFrameNames('archer_idle', {
                start: 0,
                end: 11,
                zeroPad: 3,
                prefix: 'Idle_',
                suffix: '.png'
            }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'archer_hurt',
            frames: this.anims.generateFrameNames('archer_hurt', {
                start: 0,
                end: 11,
                zeroPad: 3,
                prefix: 'Hurt_',
                suffix: '.png'
            }),
            frameRate: 24,
        });

        this.anims.create({
            key: 'archer_attacking',
            frames: this.anims.generateFrameNames('archer_attacking', {
                start: 0,
                end: 9,
                zeroPad: 3,
                prefix: 'Shooting_',
                suffix: '.png'
            }),
            frameRate: 24,
        });

        this.anims.create({
            key: 'archer_dead',
            frames: this.anims.generateFrameNames('archer_dead', {
                start: 0,
                end: 14,
                zeroPad: 3,
                prefix: 'Dying_',
                suffix: '.png'
            }),
            frameRate: 24,
        });
    }

    private loadBlackMageAnimations(): void {
        this.anims.create({
            key: 'blackmage_idle',
            frames: this.anims.generateFrameNames('blackmage_idle', {
                start: 0,
                end: 17,
                zeroPad: 3,
                prefix: 'Idle Blinking_',
                suffix: '.png'
            }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'blackmage_hurt',
            frames: this.anims.generateFrameNames('blackmage_hurt', {
                start: 0,
                end: 11,
                zeroPad: 3,
                prefix: 'Hurt_',
                suffix: '.png'
            }),
            frameRate: 24,
        });

        this.anims.create({
            key: 'blackmage_attacking',
            frames: this.anims.generateFrameNames('blackmage_attacking', {
                start: 0,
                end: 11,
                zeroPad: 3,
                prefix: 'Swinging Rod_',
                suffix: '.png'
            }),
            frameRate: 24,
        });

        this.anims.create({
            key: 'blackmage_dead',
            frames: this.anims.generateFrameNames('blackmage_dead', {
                start: 0,
                end: 14,
                zeroPad: 3,
                prefix: 'Dying_',
                suffix: '.png'
            }),
            frameRate: 24,
        });
    }

    private loadSwordmanAnimations(): void {
        this.anims.create({
            key: 'swordman_idle',
            frames: this.anims.generateFrameNames('swordman_idle', {
                start: 0,
                end: 17,
                zeroPad: 3,
                prefix: 'Idle_',
                suffix: '.png'
            }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'swordman_hurt',
            frames: this.anims.generateFrameNames('swordman_hurt', {
                start: 0,
                end: 11,
                zeroPad: 3,
                prefix: 'Hurt_',
                suffix: '.png'
            }),
            frameRate: 24,
        });

        this.anims.create({
            key: 'swordman_attacking',
            frames: this.anims.generateFrameNames('swordman_attacking', {
                start: 0,
                end: 11,
                zeroPad: 3,
                prefix: 'Slashing_',
                suffix: '.png'
            }),
            frameRate: 24,
        });

        this.anims.create({
            key: 'swordman_dead',
            frames: this.anims.generateFrameNames('swordman_dead', {
                start: 0,
                end: 14,
                zeroPad: 3,
                prefix: 'Dying_',
                suffix: '.png'
            }),
            frameRate: 24,
        });
    }

    private loadWhiteMageAnimations(): void {
        this.anims.create({
            key: 'whitemage_idle',
            frames: this.anims.generateFrameNames('whitemage_idle', {
                start: 0,
                end: 11,
                zeroPad: 3,
                prefix: 'Idle_',
                suffix: '.png'
            }),
            frameRate: 24,
            repeat: -1
        });

        this.anims.create({
            key: 'whitemage_hurt',
            frames: this.anims.generateFrameNames('whitemage_hurt', {
                start: 0,
                end: 11,
                zeroPad: 3,
                prefix: 'Hurt_',
                suffix: '.png'
            }),
            frameRate: 24,
        });

        this.anims.create({
            key: 'whitemage_attacking',
            frames: this.anims.generateFrameNames('whitemage_attacking', {
                start: 0,
                end: 17,
                zeroPad: 3,
                prefix: 'Healing_',
                suffix: '.png'
            }),
            frameRate: 24,
        });

        this.anims.create({
            key: 'whitemage_dead',
            frames: this.anims.generateFrameNames('whitemage_dead', {
                start: 0,
                end: 14,
                zeroPad: 3,
                prefix: 'Dying_',
                suffix: '.png'
            }),
            frameRate: 24,
        });
    }
}
