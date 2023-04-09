import Battlefield from "../Scenes/Battlefied";
import { DamageType, AreaOfEffect, EffectRange } from "./Enums";
import AllyQueue from "./Queues/AllyQueue";

export default class Skill {
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    static readonly spriteName: string;
    static readonly effectRange: EffectRange;
    static readonly damageType: DamageType;
    static readonly areaOfEffect: AreaOfEffect;
    static readonly scale: number = 1;

    public render(scene: Phaser.Scene, skillType: typeof Skill, x: number, y: number): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        this.sprite = scene.physics.add.sprite(
            x,
            y,
            skillType.spriteName
        ).setInteractive();

        this.sprite.body.setCircle(35);
        //this.sprite.body.setOffset(15,15);

        this.sprite.scale = skillType.scale;

        Battlefield.turnElements.add(this.sprite);

        this.sprite['__initialX'] = x;
        this.sprite['__initialY'] = y;

        scene.input.setDraggable(this.sprite);

        //this.sprite.addListener('dragend', this.onDragStop, this);

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

    private onDragStop() {
        this.configureOverlap();
    }
}
