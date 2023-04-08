import { EffectRange, RoleNames } from "./Enums";
import Skill from "./Skill";

export default abstract class Role {
    level: number = 1;
    static readonly roleName: RoleNames;
    static readonly spriteFileName = "tileset";
    static readonly positionInSpreadsheet: number;
    static readonly healthMultiplier: number;
    static readonly physicalAttackMultiplier: number;
    static readonly magicalAttackMultiplier: number;
    static readonly physicalDefenseMultiplier: number;
    static readonly magicalDefenseMultiplier: number;
    static readonly effectRange: EffectRange;
    static readonly skills: [number, typeof Skill][];

    getAvailableSkills() {
        return Role.skills.filter((skill) => skill[0] >= this.level);
    }
}
