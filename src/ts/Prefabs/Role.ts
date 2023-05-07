import Battlefield from "../Scenes/Battlefied";
import Character from "./Character";
import Ally from "./Characters/Ally";
import { RolesMap } from "./Constants";
import { EffectRange, RoleNames } from "./Enums";
import AllyQueue from "./Queues/AllyQueue";
import Skill from "./Skill";

export default abstract class Role {
    level: number = 1;
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

    public renderIcon(character: Character, role: Role, x: number, y: number, turnElements?: Phaser.GameObjects.Group): Phaser.GameObjects.Sprite {
        const allyScene = character.sprite.scene;
        const roleType = Object.values(RolesMap).find((r) => role instanceof r);

        const sprite = allyScene.add.sprite(
            x,
            y,
            roleType.icon,
        ).setInteractive();

        sprite.scale = 0.15;

        Battlefield.turnElements.add(sprite);

        const graphics = sprite.scene.make.graphics({});

        graphics.fillStyle(0xffffff);
        graphics.fillCircle(sprite.x, sprite.y, 15);

        const mask = graphics.createGeometryMask();

        sprite.setMask(mask);

        const text = allyScene.add.text(
            sprite.getTopRight().x - 15,
            sprite.getTopRight().y,
            this.level.toString(),
            {fontSize: "16px"}
        );
        text.setStroke('black', 5);

        if (turnElements) {
            turnElements.add(sprite);
            turnElements.add(text);
        }

        return sprite;
    }
}
