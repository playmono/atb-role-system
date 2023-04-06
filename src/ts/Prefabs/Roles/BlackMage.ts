import { EffectRange, RoleNames } from "../Enums";
import Role from "../Role";
import FireBolt from "../Skills/Firebolt";
import LordOfVermillion from "../Skills/LordOfVermillion";
import MedusaGlance from "../Skills/MedusaGlance";
import Ragnarok from "../Skills/Ragnarok";
import SpiritualMind from "../Skills/SpiritualMind";
import StoneCurse from "../Skills/StoneCurse";

export default class BlackMage implements Role {
    readonly roleName = RoleNames.BLACKMAGE;
    readonly positionInSpreadsheet = 4;
    readonly healthMultiplier = 2;
    readonly physicalAttackMultiplier = 1;
    readonly magicalAttackMultiplier = 5;
    readonly physicalDefenseMultiplier = 2;
    readonly magicalDefenseMultiplier = 5;
    readonly effectRange = EffectRange.One;

    readonly skills: [number, string][] = [
        [2, FireBolt.name],
        [5, StoneCurse.name],
        [10, SpiritualMind.name],
        [15, LordOfVermillion.name],
        [20, MedusaGlance.name],
        [30, Ragnarok.name]
    ];
}
