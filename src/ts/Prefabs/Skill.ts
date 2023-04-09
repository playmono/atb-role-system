import Battlefield from "../Scenes/Battlefied";
import { DamageType, AreaOfEffect, EffectRange } from "./Enums";
import AllyQueue from "./Queues/AllyQueue";

export default class Skill {
    sprite: Phaser.GameObjects.Sprite;
    static readonly spriteName = "sword";
    static readonly effectRange: EffectRange;
    static readonly damageType: DamageType;
    static readonly areaOfEffect: AreaOfEffect;

    public render(scene: Phaser.Scene): Phaser.GameObjects.Sprite {
        this.sprite = scene.physics.add.sprite(
            scene.cameras.main.centerX / 2,
            scene.cameras.main.centerY,
            Skill.spriteName
        ).setInteractive();

        Battlefield.turnElements.add(this.sprite);

        this.sprite['__initialX'] = scene.cameras.main.centerX / 2;
        this.sprite['__initialY'] = scene.cameras.main.centerY;

        this.sprite.scale = 0.5;
        scene.input.setDraggable(this.sprite);

        this.configureOverlap();

        return this.sprite;
    }

    private configureOverlap(): void {
        if (Skill.effectRange !== EffectRange.Self) {
            this.sprite.scene.physics.add.overlap(
                this.sprite,
                Battlefield.enemyGroup,
                this.onOverlap,
                null,
                this
            );

            this.sprite.scene.physics.add.overlap(
                this.sprite,
                Battlefield.allyGroup,
                this.onOverlap,
                null,
                this
            );
        }
    }

    private onOverlap(): void {
        AllyQueue.getQueue().nextTurn();
    }
}
