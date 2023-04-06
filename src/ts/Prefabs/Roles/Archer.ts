import { EffectRange, RoleNames } from "../Enums";
import Role from "../Role";
import AnkleTrap from "../Skills/AnkleTrap";
import ArrowVulcan from "../Skills/ArrowVulcan";
import Concentration from "../Skills/Concentration";
import FireArrow from "../Skills/FireArrow";
import Ragnarok from "../Skills/Ragnarok";
import SharpShoot from "../Skills/SharpShoot";

export default class Archer implements Role {
    readonly roleName = RoleNames.ARCHER;
    readonly positionInSpreadsheet = 2;
    readonly healthMultiplier = 3;
    readonly physicalAttackMultiplier = 4;
    readonly magicalAttackMultiplier = 2;
    readonly physicalDefenseMultiplier = 1;
    readonly magicalDefenseMultiplier = 1;
    readonly effectRange = EffectRange.Two;

    readonly skills: [number, string][] = [
        [2, FireArrow.name],
        [5, Concentration.name],
        [10, AnkleTrap.name],
        [15, ArrowVulcan.name],
        [20, SharpShoot.name],
        [30, Ragnarok.name]
    ];
}
