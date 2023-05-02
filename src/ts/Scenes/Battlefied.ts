import { Columns, Rows } from "../Prefabs/Enums";
import Hero from "../Prefabs/Characters/Ally";
import Enemy from "../Prefabs/Characters/Enemy";
import Utilities from "../Utilities";
import AllyExperienceBar from "../Prefabs/ExperienceBars/AllyExperienceBar";
import EnemyExperienceBar from "../Prefabs/ExperienceBars/EnemyExperienceBar";

export default class Battlefield extends Phaser.Scene {
    public static Name = "Battlefield";
    static allyGroup: Phaser.GameObjects.Group;
    static enemyGroup: Phaser.GameObjects.Group;
    static turnElements: Phaser.GameObjects.Group;

    public preload(): void {
        this.loadNoviceAnimations();
        this.loadArcherAnimations();
        this.loadBlackMageAnimations();
        this.loadSwordmanAnimations();
        this.loadWhiteMageAnimations();
    }

    public create(): void {
        Utilities.LogSceneMethodEntry("Battlefield", "create");

        Battlefield.enemyGroup = this.physics.add.group();
        Battlefield.allyGroup = this.physics.add.group();
        Battlefield.turnElements = this.physics.add.group();

        const hero1 = new Hero()
        hero1.render(this, Columns.FIRST_COLUMN);
        Battlefield.allyGroup.add(hero1.sprite);

        const hero2 = new Hero();
        hero2.render(this, Columns.SECOND_COLUMN);
        Battlefield.allyGroup.add(hero2.sprite);

        const hero3 = new Hero();
        hero3.render(this, Columns.THIRD_COLUMN);
        Battlefield.allyGroup.add(hero3.sprite);

        const hero4 = new Hero();
        hero4.render(this, Columns.FOURTH_COLUMN);
        Battlefield.allyGroup.add(hero4.sprite);

        const enemy1 = new Enemy();
        enemy1.render(this, Columns.FIRST_COLUMN);
        Battlefield.enemyGroup.add(enemy1.sprite);

        const enemy2 = new Enemy();
        enemy2.render(this, Columns.SECOND_COLUMN);
        Battlefield.enemyGroup.add(enemy2.sprite);

        const enemy3 = new Enemy();
        enemy3.render(this, Columns.THIRD_COLUMN);
        Battlefield.enemyGroup.add(enemy3.sprite);

        const enemy4 = new Enemy();
        enemy4.render(this, Columns.FOURTH_COLUMN);
        Battlefield.enemyGroup.add(enemy4.sprite);

        //AllyExperienceBar.getExperienceBar().render(this);
        //EnemyExperienceBar.getExperienceBar().render(this);

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });

        this.input.on('dragend', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = gameObject.__initialX;
            gameObject.y = gameObject.__initialY;
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
