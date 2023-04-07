import { EffectRange, RoleNames } from "../Enums";
import Role from "../Role";
import Attack from "../Skills/Attack";
import Skill from "../Skill";

export default class Novice implements Role {
    static readonly spriteFileName = "tileset";
    static readonly roleName = RoleNames.NOVICE;
    static readonly positionInSpreadsheet =7;
    static readonly healthMultiplier = 1;
    static readonly physicalAttackMultiplier = 1;
    static readonly magicalAttackMultiplier = 1;
    static readonly physicalDefenseMultiplier = 1;
    static readonly magicalDefenseMultiplier = 1;
    static readonly effectRange = EffectRange.One;

    static readonly skills: [number, typeof Skill][] = [
        [1, Attack]
    ];
}
