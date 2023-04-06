import { EffectRange, RoleNames } from "../Enums";
import Role from "../Role";

export default class Novice implements Role {
    readonly roleName = RoleNames.NOVICE;
    readonly positionInSpreadsheet =7;
    readonly healthMultiplier = 1;
    readonly physicalAttackMultiplier = 1;
    readonly magicalAttackMultiplier = 1;
    readonly physicalDefenseMultiplier = 1;
    readonly magicalDefenseMultiplier = 1;
    readonly effectRange = EffectRange.One;

    readonly skills = [
    ];
}
