import { EffectRange } from "../Enums";
import { Role } from "../Role";
import { Blessing } from "../Skills/Blessing";
import { Cure } from "../Skills/Cure";
import { Heal } from "../Skills/Heal";
import { Ragnarok } from "../Skills/Ragnarok";
import { Resurrection } from "../Skills/Resurrection";
import { Sanctuary } from "../Skills/Sanctuary";

export class WhiteMage extends Role {
    healthMultiplier: 3;
    physicalAttackMultiplier: 4;
    magicalAttackMultiplier: 2;
    physicalDefenseMultiplier: 1;
    magicalDefenseMultiplier: 1;
    effectRange: EffectRange.One;

    skills: [
        [Heal, 2],
        [Cure, 5],
        [Blessing, 10],
        [Resurrection, 15],
        [Sanctuary, 20],
        [Ragnarok, 30]
    ];
}
