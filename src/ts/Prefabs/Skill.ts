import BattleField from "../Scenes/Battlefied";
import { DamageType, AreaOfEffect, EffectRange } from "./Enums";
import AllyQueue from "./Queues/AllyQueue";

export default class Skill {
    sprite: Phaser.GameObjects.Sprite;
    static readonly spriteName = "sword";
    static readonly effectRange: EffectRange;
    static readonly damageType: DamageType;
    static readonly areaOfEffect: AreaOfEffect;

    render(scene: Phaser.Scene): Phaser.GameObjects.Sprite {
        this.sprite = scene.physics.add.sprite(
            scene.cameras.main.centerX,
            scene.cameras.main.centerY,
            Skill.spriteName
        ).setInteractive();

        this.sprite['__initialX'] = scene.cameras.main.centerX;
        this.sprite['__initialY'] = scene.cameras.main.centerY;

        this.sprite.scale = 0.5;
        scene.input.setDraggable(this.sprite);

        this.configureOverlap();

        return this.sprite;
    }

    configureOverlap() {
        if (Skill.effectRange !== EffectRange.Self) {
            this.sprite.scene.physics.add.overlap(
                this.sprite,
                BattleField.enemyGroup,
                this.onOverlap,
                null,
                this
            );

            this.sprite.scene.physics.add.overlap(
                this.sprite,
                BattleField.allyGroup,
                this.onOverlap,
                null,
                this
            );
        }
    }

    onOverlap() {
        const hero = AllyQueue.getQueue().getFirst();
        hero.sprite.setTint(0xa3e0ff);
        hero.atbBar.progressBar.destroy();
        hero.atbBar.render();
        this.sprite.destroy();
        AllyQueue.getQueue().nextTurn();
    }
}
