import { EffectRange, RoleNames } from "../Enums";
import Role from "../Role";
import Blessing from "../Skills/Blessing";
import Cure from "../Skills/Cure";
import Heal from "../Skills/Heal";
import Ragnarok from "../Skills/Ragnarok";
import Resurrection from "../Skills/Resurrection";
import Sanctuary from "../Skills/Sanctuary";

export default class WhiteMage implements Role {
    readonly roleName = RoleNames.WHITE_MAGE;
    readonly positionInSpreadsheet = 5;
    readonly healthMultiplier = 3;
    readonly physicalAttackMultiplier = 4;
    readonly magicalAttackMultiplier = 2;
    readonly physicalDefenseMultiplier = 1;
    readonly magicalDefenseMultiplier = 1;
    readonly effectRange = EffectRange.One;

    readonly skills: [number, string][] = [
        [2, Heal.name],
        [5, Cure.name],
        [10, Blessing.name],
        [15, Resurrection.name],
        [20, Sanctuary.name],
        [30, Ragnarok.name]
    ];
}
