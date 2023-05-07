import { EffectRange, RoleNames } from "../Enums";
import Role from "../Role";
import Skill from "../Skill";
import Attack from "../Skills/Attack";
import Bash from "../Skills/Bash";
import Berserk from "../Skills/Berserk";
import MagnumBreak from "../Skills/MagnumBreak";
import Protection from "../Skills/Protection";
import Provoke from "../Skills/Provoke";
import Ragnarok from "../Skills/Ragnarok";

export default class Swordman extends Role {
    static readonly icon = 'swordman_icon';
    static readonly hexColor = 0xfffc33;
    static readonly idleAnimation = 'swordman_idle';
    static readonly spriteScale = 0.15;
    static readonly spriteOffsetY = 0;

    static readonly healthMultiplier = 3;
    static readonly physicalAttackMultiplier = 4;
    static readonly magicalAttackMultiplier = 2;
    static readonly physicalDefenseMultiplier = 1;
    static readonly magicalDefenseMultiplier = 1;
    static readonly effectRange = EffectRange.One;

    static readonly skills: [number, typeof Skill][] = [
        //[1, Attack],
        [2, Bash],
        /*[5, Provoke],
        [10, Protection],
        [15, Berserk],
        [20, MagnumBreak],
        [30, Ragnarok]*/
    ];

    public getAvailableSkills(): [number, typeof Skill][] {
        return Swordman.skills.filter((skill) => skill[0] <= this.level);
    }
}
