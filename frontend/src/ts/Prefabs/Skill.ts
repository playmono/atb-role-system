import Battlefield from "../Scenes/Battlefied";
import Ally from "./Characters/Ally";
import { SkillsMap } from "./Constants";
import { DamageType, AreaOfEffect, EffectRange } from "./Enums";
import Experience from "./Experience";
import GameServer from "./GameServer";

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
    static readonly damage: number = -20;
    static readonly soundEffect: string = 'spell';

    static readonly skills: [number, typeof Skill][];

    static readonly initialValues = {
        scale: 0.15,
        radius: 15
    };

    static readonly dragValues = {
        scale: 0.25,
        radius: 30
    };

    public constructor(ally?: Ally) {
        this.ally = ally;
    }

    public applyEffect(): void {
        // To override
    }

    public renderIcon(scene: Phaser.Scene, x: number, y: number, skillType: typeof Skill, group?: Phaser.GameObjects.Group) {
        this.sprite = scene.physics.add.sprite(
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

        const circle = this.sprite.scene.make.graphics({})
        circle.fillStyle(0xffffff);
        circle.fillCircle(this.sprite.x, this.sprite.y, Skill.initialValues.radius);
        this.mask = circle.createGeometryMask();
        this.sprite.setMask(this.mask);

        if (group) {
            group.addMultiple([this.sprite, circle]);
        }

        return this.sprite;
    }

    public renderAllySkill(skillType: typeof Skill, skillLevel: number, x: number, y: number): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        if (!this.ally) {
            throw Error('Cannot render an ally skill without ally.');
        }

        this.renderIcon(this.ally.sprite.scene, x, y, skillType, Battlefield.turnElements);

        this.sprite['__initialX'] = x;
        this.sprite['__initialY'] = y;

        this.configureOverlap();

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

        if (appliedOn.healthCurrent <= 0) {
            return;
        }

        // DAMAGE FORMULA
        /*const damage = skillType.damageType === DamageType.Physical ?
            (character.attackPhysical - appliedOn.defensePhysical) * skillType.damage :
            (character.attackMagical - appliedOn.defenseMagical) * skillType.damage;

        */

        skillSprite.scene.sound.play(skillType.soundEffect);

        const anim = this.ally.sprite.play(`${this.ally.getBaseAnimation()}_attacking`);
        anim.on(
            Phaser.Animations.Events.ANIMATION_COMPLETE,
            () => this.ally.sprite.play(`${this.ally.getBaseAnimation()}_idle`),
            this
        );

        appliedOn.receiveSkill(skillType.damage);

        const gameServer = new GameServer();
        gameServer.gameConnection.send({
            type: 'characterReceivedSkill',
            data: {
                from: this.ally.column,
                to: appliedOn.column,
                characterType: appliedOn instanceof Ally ? 'ally' : 'enemy',
                skillType: skillType.className
            }
        });

        if (this.ally.currentRole.currentExperience >= this.ally.currentRole.getExperienceToNextLevel()) {
            this.ally.levelUp();
            const gameServer = new GameServer();
                gameServer.gameConnection.send({
                    type: 'enemyStatus',
                    data: {
                        from: this.ally.column,
                        level: this.ally.currentRole.level,
                    }
                });
        }

        this.ally.endTurn(true);
    }

    private onOverlapWithExperience(skill: any, experienceIcon: any)  {
        skill.scene.sound.play('experience');
        experienceIcon['__parentClass'].sendToAlly(skill['__parentClass'].ally);
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
