import { Columns, Rows } from "../Prefabs/Enums";
import Hero from "../Prefabs/Characters/Ally";
import Enemy from "../Prefabs/Characters/Enemy";
import Utilities from "../Utilities";
import Experience from "../Prefabs/Experience";
import GameServer from "../Prefabs/GameServer";
import Trail from "../Prefabs/Trail";
import Skill from "../Prefabs/Skill";
import Attack from "../Prefabs/Skills/Attack";
import { RolesMap, SkillsMap } from "../Prefabs/Constants";

export default class Battlefield extends Phaser.Scene {
    static Name = "Battlefield";
    static allyGroup: Phaser.GameObjects.Group;
    static enemyGroup: Phaser.GameObjects.Group;
    static turnElements: Phaser.GameObjects.Group;
    public battlefieldIsReady = false;
    public trail: Trail;
    public enemyTrail: Trail;

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

        this.configureListeners();

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

        const experience = new Experience(experienceField);
        experience.render(this);

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

    public configureListeners(): void {
        const gameServer = new GameServer();

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
            const skillType = SkillsMap[data.skillType];
            const skill = new skillType();
            const sprite = skill.renderIcon(this, from.x, from.y, skillType);
            sprite.setAlpha(0.7);
            const mask = sprite.mask as any;

            this.tweens.add({
                targets: skill.sprite,
                x: to.x,
                y: to.y,
                duration: 500,
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
                prefix: 'Idle_',
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
            key: 'novice_girl_idle',
            frames: this.anims.generateFrameNames('novice_girl_idle', {
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
    }

    private loadBlackMageAnimations(): void {
        this.anims.create({
            key: 'blackmage_idle',
            frames: this.anims.generateFrameNames('blackmage_idle', {
                start: 0,
                end: 17,
                zeroPad: 3,
                prefix: 'Idle_',
                suffix: '.png'
            }),
            frameRate: 24,
            repeat: -1
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
    }
}
