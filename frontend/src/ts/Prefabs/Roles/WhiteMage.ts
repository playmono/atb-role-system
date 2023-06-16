import { EffectRange, RoleNames } from "../Enums";
import Role from "../Role";
import Skill from "../Skill";
import Attack from "../Skills/Attack";
import Blessing from "../Skills/Blessing";
import Dispel from "../Skills/Dispel";
import Heal from "../Skills/Heal";
import Ragnarok from "../Skills/Ragnarok";
import Resurrection from "../Skills/Resurrection";
import Sanctuary from "../Skills/Sanctuary";

export default class WhiteMage extends Role {
    static readonly className = "WhiteMage";
    static readonly icon = 'whitemage_icon';
    static readonly hexColor = 0x0afc00;
    static readonly baseAnimation = 'whitemage';
    static readonly spriteScale = 0.25;
    static readonly spriteOffsetY = 4;

    static readonly healthMultiplier = 3;
    static readonly physicalAttackMultiplier = 4;
    static readonly magicalAttackMultiplier = 2;
    static readonly physicalDefenseMultiplier = 1;
    static readonly magicalDefenseMultiplier = 1;
    static readonly effectRange = EffectRange.One;

    static readonly skills: [number, typeof Skill][] = [
        [1, Attack],
        [1, Heal],
        [5, Dispel],
        [10, Blessing],
        [15, Resurrection],
        /*[20, Sanctuary],
        [30, Ragnarok]*/
    ];

    getAvailableSkills(): [number, typeof Skill][] {
        return WhiteMage.skills.filter((skill) => skill[0] <= this.level);
    }
}
