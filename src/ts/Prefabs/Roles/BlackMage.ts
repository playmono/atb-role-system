import { EffectRange } from "../Enums";
import { Role } from "../Role";
import { FireBolt } from "../Skills/Firebolt";
import { LordOfVermillion } from "../Skills/LordOfVermillion";
import { MedusaGlance } from "../Skills/MedusaGlance";
import { Ragnarok } from "../Skills/Ragnarok";
import { SpiritualMind } from "../Skills/SpiritualMind";
import { StoneCurse } from "../Skills/StoneCurse";

export class BlackMage extends Role {
    healthMultiplier: 2;
    physicalAttackMultiplier: 1;
    magicalAttackMultiplier: 5;
    physicalDefenseMultiplier: 2;
    magicalDefenseMultiplier: 5;
    effectRange: EffectRange.One;

    skills: [
        [FireBolt, 2],
        [StoneCurse, 5],
        [SpiritualMind, 10],
        [LordOfVermillion, 15],
        [MedusaGlance, 20],
        [Ragnarok, 30]
    ];
}
