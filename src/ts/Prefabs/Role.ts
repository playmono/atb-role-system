import { EffectRange, RoleNames } from "./Enums";
import Skill from "./Skill";

export default abstract class Role {
    static readonly roleName: RoleNames;
    static readonly spriteFileName = "tileset";
    static readonly positionInSpreadsheet;
    static readonly healthMultiplier: number;
    static readonly physicalAttackMultiplier: number;
    static readonly magicalAttackMultiplier: number;
    static readonly physicalDefenseMultiplier: number;
    static readonly magicalDefenseMultiplier: number;
    static readonly effectRange: EffectRange;
    static readonly skills: [number, typeof Skill][];
}
