import Battlefield from "../Scenes/Battlefied";
import { DamageType, AreaOfEffect, EffectRange } from "./Enums";
import AllyExperienceBar from "./ExperienceBars/AllyExperienceBar";
import AllyQueue from "./Queues/AllyQueue";

export default class Skill {
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    static readonly scale: number = 1;
    static readonly spriteName: string;
    static readonly effectRange: EffectRange;
    static readonly damageType: DamageType;
    static readonly areaOfEffect: AreaOfEffect;
    static readonly damage: number = -10;

    public applyEffect(): void {
        // To override
    }

    public render(scene: Phaser.Scene, skillType: typeof Skill, x: number, y: number): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        this.sprite = scene.physics.add.sprite(
            x,
            y,
            skillType.spriteName
        ).setInteractive();

        this.sprite['__parentClass'] = this;
        this.sprite['__typeOfParentClass'] = skillType;

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

    private onOverlap(
        skillSprite: any,
        targetSprite: any
    ): void {
        const character = AllyQueue.getQueue().getFirst();
        const appliedOn = targetSprite.__parentClass;
        const skill = skillSprite.__parentClass;
        const skillType = skillSprite.__typeOfParentClass;

        // DAMAGE FORMULA
        /*const damage = skillType.damageType === DamageType.Physical ?
            (character.attackPhysical - appliedOn.defensePhysical) * skillType.damage :
            (character.attackMagical - appliedOn.defenseMagical) * skillType.damage;

        */

        appliedOn.receiveSkill(skillType.damage);
        //AllyExperienceBar.getExperienceBar().update(150);
        AllyQueue.getQueue().nextTurn();

        character.levelUp();
    }

    private onDragStop(): void {
        this.configureOverlap();
    }
}
