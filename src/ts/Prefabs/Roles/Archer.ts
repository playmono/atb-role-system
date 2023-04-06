import { EffectRange } from "../Enums";
import { Role } from "../Role";
import { AnkleTrap } from "../Skills/AnkleTrap";
import { ArrowVulcan } from "../Skills/ArrowVulcan";
import { Concentration } from "../Skills/Concentration";
import { FireArrow } from "../Skills/FireArrow";
import { Ragnarok } from "../Skills/Ragnarok";
import { SharpShoot } from "../Skills/SharpShoot";

export class Archer extends Role {
    healthMultiplier: 3;
    physicalAttackMultiplier: 4;
    magicalAttackMultiplier: 2;
    physicalDefenseMultiplier: 1;
    magicalDefenseMultiplier: 1;
    effectRange: EffectRange.Two;

    skills: [
        [FireArrow, 2],
        [Concentration, 5],
        [AnkleTrap, 10],
        [ArrowVulcan, 15],
        [SharpShoot, 20],
        [Ragnarok, 30]
    ];
}
