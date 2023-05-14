import Character from "./Character";
import { RolesMap } from "./Constants";
import { EffectRange } from "./Enums";
import Skill from "./Skill";

export default abstract class Role {
    level: number = 1;
    text: Phaser.GameObjects.Text;
    roleIcon: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    experienceGraphic: Phaser.GameObjects.Graphics;
    emitter: Phaser.GameObjects.Particles.ParticleEmitter;
    currentExperience: number = 0;
    hexColor: number;

    static readonly icon: string;
    static readonly idleAnimation: string;
    static readonly spriteScale: number;
    static readonly spriteOffsetY: number;
    static readonly healthMultiplier: number;
    static readonly physicalAttackMultiplier: number;
    static readonly magicalAttackMultiplier: number;
    static readonly physicalDefenseMultiplier: number;
    static readonly magicalDefenseMultiplier: number;
    static readonly effectRange: EffectRange;
    static readonly skills: [number, typeof Skill][];

    public renderIcon(
        character: Character,
        role: Role,
        x: number,
        y: number,
        turnElements?: Phaser.GameObjects.Group
    ): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        const allyScene = character.sprite.scene;
        const roleType = Object.values(RolesMap).find((r) => role instanceof r);

        this.hexColor = roleType.hexColor;

        this.emitter = allyScene.add.particles(x, y, 'flares', {
            frame: [ 'white' ],
            lifespan: 1000,
            speed: { min: 30, max: 50 },
            scale: { start: 0.4, end: 0 },
            gravityY: 30,
            blendMode: 'ADD',
            emitting: false,
            tint: roleType.hexColor
        });
        this.emitter.setDepth(-1);

        this.experienceGraphic = allyScene.add.graphics({ lineStyle: { color: 0x00ff00 } });
        this.updateExperienceGraphic(x, y);

        this.roleIcon = allyScene.physics.add.sprite(
            x,
            y,
            roleType.icon
        )
        .setInteractive()
        .setScale(0.15)
        .setCircle(100)
        .setOffset(25, 25);

        const maskCercle = this.roleIcon.scene.make.graphics({});
        maskCercle.fillStyle(0xffffff);
        maskCercle.fillCircle(this.roleIcon.x, this.roleIcon.y, 15);

        const mask = maskCercle.createGeometryMask();

        this.roleIcon.setMask(mask);

        this.text = allyScene.add.text(
            this.roleIcon.getTopRight().x - 15,
            this.roleIcon.getTopRight().y,
            '',
            {fontSize: "16px"}
        );
        this.text.setStroke('black', 5);

        this.updateText();

        if (turnElements) {
            turnElements.addMultiple([
                this.roleIcon,
                this.text,
                this.experienceGraphic,
                //this.emitter // I cannot add this one or the overlap crashes
            ]);
        }

        return this.roleIcon;
    }

    public destroy(): void
    {
        this.roleIcon.destroy();
        this.text.destroy();
        this.experienceGraphic.destroy();
        this.emitter.destroy();
    }

    public levelUp(): void {
        this.level++;
        this.currentExperience = 0;
        this.updateExperienceGraphic();
        this.updateText();
    }

    public updateText(): void {
        this.text.setText(this.level.toString());
    }

    public addExperience(experience: number) {
        this.currentExperience += experience;
        this.updateExperienceGraphic();
    }

    public updateExperienceGraphic(x?: number, y?: number): void {
        const bottomCercle =  Phaser.Math.PI2 / 4;
        const area = this.currentExperience * Math.PI / this.getExperienceToNextLevel();

        if (x === undefined) {
            x = this.roleIcon.x;
        }

        if (y === undefined) {
            y = this.roleIcon.y;
        }

        this.experienceGraphic.clear();
        this.experienceGraphic.beginPath();
        this.experienceGraphic.fillStyle(this.hexColor);
        this.experienceGraphic.arc(x, y, 20, bottomCercle - area, bottomCercle + area);
        this.experienceGraphic.fillPath();

        if (this.currentExperience >= this.getExperienceToNextLevel()) {
            this.emitter.start();
        } else {
            this.emitter.stop();
        }
    }

    public getExperienceToNextLevel(): number {
        return (this.level / 0.15) ** 1.8;
    }
}
