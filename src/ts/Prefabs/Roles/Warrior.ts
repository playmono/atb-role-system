import { EffectRange } from "../Enums";
import { Role } from "../Role";
import { Bash } from "../Skills/Bash";
import { Berserk } from "../Skills/Berserk";
import { MagnumBreak } from "../Skills/MagnumBreak";
import { Protection } from "../Skills/Protection";
import { Provoke } from "../Skills/Provoke";
import { Ragnarok } from "../Skills/Ragnarok";

export class Warrior extends Role {
    healthMultiplier: 3;
    physicalAttackMultiplier: 4;
    magicalAttackMultiplier: 2;
    physicalDefenseMultiplier: 1;
    magicalDefenseMultiplier: 1;
    effectRange: EffectRange.One;

    skills: [
        [Bash, 2],
        [Provoke, 5],
        [Protection, 10],
        [Berserk, 15],
        [MagnumBreak, 20],
        [Ragnarok, 30]
    ];
}
