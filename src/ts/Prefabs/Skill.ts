import Battlefield from "../Scenes/Battlefied";
import { DamageType, AreaOfEffect, EffectRange } from "./Enums";
import AllyExperienceBar from "./ExperienceBars/AllyExperienceBar";
import AllyQueue from "./Queues/AllyQueue";

export default class Skill {
    container: Phaser.GameObjects.Container;
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    mask: Phaser.Display.Masks.GeometryMask;

    static readonly scale: number = 1;
    static readonly spriteName: string;
    static readonly effectRange: EffectRange;
    static readonly damageType: DamageType;
    static readonly areaOfEffect: AreaOfEffect;
    static readonly damage: number = -10;

    static readonly initialValues = {
        scale: 0.10,
        radius: 10
    };

    static readonly dragValues = {
        scale: 0.25,
        radius: 30
    };

    public applyEffect(): void {
        // To override
    }

    public render(scene: Phaser.Scene, skillType: typeof Skill, x: number, y: number): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        this.sprite = scene.physics.add.sprite(
            0,
            0,
            skillType.spriteName
        );
        this.sprite.scale = Skill.initialValues.scale;
        this.sprite['__parentClass'] = this;
        this.sprite['__typeOfParentClass'] = skillType;

        this.container = scene.add.container(x, y, [this.sprite] );
        this.container.setSize(80, 80);
        this.container.setInteractive({ draggable: true });

        this.container['__initialX'] = x;
        this.container['__initialY'] = y;

        Battlefield.turnElements.add(this.container);

        //this.configureOverlap();

        const circle = this.sprite.scene.make.graphics({})
        circle.fillStyle(0xffffff);
        circle.fillCircle(this.container.x, this.container.y, Skill.initialValues.radius);
        this.mask = circle.createGeometryMask();
        this.container.setMask(this.mask);

        scene.input.setDraggable(this.container);
        this.container.addListener('drag', this.isDragging, this);
        this.container.addListener('dragend', this.onDragStop, this);

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
        /*
        appliedOn.receiveSkill(skillType.damage);
        //AllyExperienceBar.getExperienceBar().update(150);
        AllyQueue.getQueue().nextTurn();

        character.levelUp();
        */
    }

    private isDragging(pointer: Phaser.Input.Pointer, dragX: number, dragY: number): void {
        this.mask.geometryMask.clear();
        this.mask.geometryMask.fillCircle(this.container.x, this.container.y, Skill.dragValues.radius);
        this.sprite.scale = Skill.dragValues.scale;

    }

    private onDragStop(): void {
        this.configureOverlap();
        this.mask.geometryMask.clear();
        this.mask.geometryMask.fillCircle(this.container['__initialX'], this.container['__initialY'], Skill.initialValues.radius);
        this.sprite.scale = Skill.initialValues.scale;
    }
}
