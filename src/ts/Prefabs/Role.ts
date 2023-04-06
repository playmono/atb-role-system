import { EffectRange, RoleNames } from "./Enums";
import Skill from "./Skill";

export default abstract class Role {
    abstract readonly roleName: RoleNames;
    static readonly spriteFileName = "tileset";
    abstract readonly positionInSpreadsheet;
    abstract readonly healthMultiplier: number;
    abstract readonly physicalAttackMultiplier: number;
    abstract readonly magicalAttackMultiplier: number;
    abstract readonly physicalDefenseMultiplier: number;
    abstract readonly magicalDefenseMultiplier: number;
    abstract readonly effectRange: EffectRange;
    abstract readonly skills: [number, string][];
}
