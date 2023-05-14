import Battlefield from "../Scenes/Battlefied";
import Ally from "./Characters/Ally";
import { DamageType, AreaOfEffect, EffectRange } from "./Enums";
import Experience from "./Experience";

export default class Skill {
    ally: Ally;
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    mask: Phaser.Display.Masks.GeometryMask;
    expIcon: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    static readonly scale: number = 1;
    static readonly spriteName: string;
    static readonly effectRange: EffectRange;
    static readonly damageType: DamageType;
    static readonly areaOfEffect: AreaOfEffect;
    static readonly damage: number = -10;

    static readonly skills: [number, typeof Skill][];

    static readonly initialValues = {
        scale: 0.15,
        radius: 15
    };

    static readonly dragValues = {
        scale: 0.25,
        radius: 30
    };

    public constructor(ally: Ally) {
        this.ally = ally;
    }

    public applyEffect(): void {
        // To override
    }

    public render(skillType: typeof Skill, skillLevel: number, x: number, y: number): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        // CAREFUL: this.ally.sprite maybe doesnt exist
        this.sprite = this.ally.sprite.scene.physics.add.sprite(
            x,
            y,
            skillType.spriteName
        )
        .setScale(0.15)
        .setCircle(100)
        .setOffset(25, 25)
        .setScale(Skill.initialValues.scale);

        this.sprite['__parentClass'] = this;
        this.sprite['__typeOfParentClass'] = skillType;

        this.sprite['__initialX'] = x;
        this.sprite['__initialY'] = y;

        Battlefield.turnElements.add(this.sprite);

        this.configureOverlap();

        const circle = this.sprite.scene.make.graphics({})
        circle.fillStyle(0xffffff);
        circle.fillCircle(this.sprite.x, this.sprite.y, Skill.initialValues.radius);
        this.mask = circle.createGeometryMask();
        this.sprite.setMask(this.mask);

        Battlefield.turnElements.add(circle);

        if (skillLevel > this.ally.currentRole.level) {
            this.sprite.setAlpha(0.2);
        } else {
            this.sprite.setInteractive({ draggable: true });
            this.sprite.scene.input.setDraggable(this.sprite);
            this.sprite.addListener('drag', this.isDragging, this);
            this.sprite.addListener('dragend', this.onDragStop, this);
        }

        return this.sprite;
    }

    private configureOverlap(): void {
        this.sprite.scene.physics.add.overlap(
            this.sprite,
            Battlefield.enemyGroup,
            this.onOverlap,
            null,
            this
        );

        this.sprite.scene.physics.add.overlap(
            this.sprite,
            Experience.icon,
            this.onOverlapWithExperience,
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

    private onOverlap(
        skillSprite: any,
        targetSprite: any
    ): void {
        const appliedOn = targetSprite.__parentClass;
        const skill = skillSprite.__parentClass;
        const skillType = skillSprite.__typeOfParentClass;

        // DAMAGE FORMULA
        /*const damage = skillType.damageType === DamageType.Physical ?
            (character.attackPhysical - appliedOn.defensePhysical) * skillType.damage :
            (character.attackMagical - appliedOn.defenseMagical) * skillType.damage;

        */

        appliedOn.receiveSkill(skillType.damage);

        if (this.ally.currentRole.currentExperience >= this.ally.currentRole.getExperienceToNextLevel()) {
            this.ally.levelUp();
        }

        this.ally.endTurn();
    }

    private onOverlapWithExperience(skill: any, experienceIcon: any)  {
        experienceIcon['__parentClass'].restart();
        this.ally.addExperience(100);
    }

    private isDragging(pointer: Phaser.Input.Pointer, dragX: number, dragY: number): void {
        this.mask.geometryMask.clear();
        this.mask.geometryMask.fillCircle(this.sprite.x, this.sprite.y, Skill.dragValues.radius);
        this.sprite.scale = Skill.dragValues.scale;
    }

    private onDragStop(): void {
        //this.configureOverlap();
        this.mask.geometryMask.clear();
        this.mask.geometryMask.fillCircle(this.sprite['__initialX'], this.sprite['__initialY'], Skill.initialValues.radius);
        this.sprite.scale = Skill.initialValues.scale;
    }
}
