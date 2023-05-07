import Battlefield from "../Scenes/Battlefied";
import Character from "./Character";
import Ally from "./Characters/Ally";
import { RolesMap } from "./Constants";
import { EffectRange, RoleNames } from "./Enums";
import AllyQueue from "./Queues/AllyQueue";
import Skill from "./Skill";

export default abstract class Role {
    level: number = 1;
    text: Phaser.GameObjects.Text;

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

    public getAvailableSkills(): [number, typeof Skill][] {
        return Role.skills.filter((skill) => skill[0] <= this.level);
    }

    public renderIcon(
        character: Character,
        role: Role,
        x: number,
        y: number,
        turnElements?: Phaser.GameObjects.Group
    ): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        const allyScene = character.sprite.scene;
        const roleType = Object.values(RolesMap).find((r) => role instanceof r);

        const sprite = allyScene.physics.add.sprite(
            x,
            y,
            roleType.icon,
        )
        .setInteractive()
        .setScale(0.15)
        .setCircle(100)
        .setOffset(25, 25);

        const graphics = sprite.scene.make.graphics({});

        graphics.fillStyle(0xffffff);
        graphics.fillCircle(sprite.x, sprite.y, 15);

        const mask = graphics.createGeometryMask();

        sprite.setMask(mask);

        this.text = allyScene.add.text(
            sprite.getTopRight().x - 15,
            sprite.getTopRight().y,
            '',
            {fontSize: "16px"}
        );
        this.text.setStroke('black', 5);

        if (turnElements) {
            turnElements.add(sprite);
            turnElements.add(this.text);
        }

        this.updateText();

        return sprite;
    }

    public levelUp(): void {
        this.level++;
        this.updateText();
    }

    public updateText(): void {
        this.text.setText(this.level.toString());
    }
}
