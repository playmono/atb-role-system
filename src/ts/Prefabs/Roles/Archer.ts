import { EffectRange, RoleNames } from "../Enums";
import Role from "../Role";
import Skill from "../Skill";
import AnkleTrap from "../Skills/AnkleTrap";
import ArrowVulcan from "../Skills/ArrowVulcan";
import Attack from "../Skills/Attack";
import Concentration from "../Skills/Concentration";
import FireArrow from "../Skills/FireArrow";
import Ragnarok from "../Skills/Ragnarok";
import SharpShoot from "../Skills/SharpShoot";

export default class Archer extends Role {
    static readonly roleName = RoleNames.ARCHER;
    static readonly icon = 'archer_icon';
    static readonly idleAnimation = 'archer_idle';
    static readonly spriteScale = 0.25;
    static readonly spriteOffsetY = 7;

    static readonly healthMultiplier = 3;
    static readonly physicalAttackMultiplier = 4;
    static readonly magicalAttackMultiplier = 2;
    static readonly physicalDefenseMultiplier = 1;
    static readonly magicalDefenseMultiplier = 1;
    static readonly effectRange = EffectRange.Two;

    static readonly skills: [number, typeof Skill][] = [
        //[1, Attack],
        [2, FireArrow],
        /*[5, Concentration],
        [10, AnkleTrap],
        [15, ArrowVulcan],
        [20, SharpShoot],
        [30, Ragnarok]*/
    ];

    public getAvailableSkills(): [number, typeof Skill][] {
        return Archer.skills.filter((skill) => skill[0] <= this.level);
    }
}
