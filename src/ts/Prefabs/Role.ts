import Battlefield from "../Scenes/Battlefied";
import Ally from "./Characters/Ally";
import { RolesMap } from "./Constants";
import { EffectRange, RoleNames } from "./Enums";
import AllyQueue from "./Queues/AllyQueue";
import Skill from "./Skill";

export default abstract class Role {
    level: number = 1;
    static readonly icon: string;
    static readonly roleName: RoleNames;
    static readonly idleAnimation: string;
    static readonly spriteScale: number;
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

    public renderIcon(ally: Ally, role: Role, x: number, y: number): void {
        const allyScene = ally.sprite.scene;
        const roleType = Object.values(RolesMap).find((r) => role instanceof r);;

        const sprite = allyScene.add.sprite(
            x,
            y,
            roleType.icon,
        ).setInteractive();

        sprite.scale = 0.20;

        Battlefield.turnElements.add(sprite);

        if (ally.currentRoleType === roleType) {
            //sprite.setBlendMode(Phaser.BlendModes.LUMINOSITY);
        } else {
            sprite.on('pointerdown', (pointer) => {
                ally.setRole(roleType);
                ally.renderRole(allyScene);
                AllyQueue.getQueue().nextTurn();
            });
        }

        const text = allyScene.add.text(
            sprite.getTopRight().x - 15,
            sprite.getTopRight().y,
            this.level.toString(),
            {fontSize: "20px"}
        );
        text.setStroke('black', 5);

        Battlefield.turnElements.add(text);
    }
}
