import { EffectRange, RoleNames } from "../Enums";
import Role from "../Role";
import Skill from "../Skill";
import Attack from "../Skills/Attack";
import Blessing from "../Skills/Blessing";
import Cure from "../Skills/Cure";
import Heal from "../Skills/Heal";
import Ragnarok from "../Skills/Ragnarok";
import Resurrection from "../Skills/Resurrection";
import Sanctuary from "../Skills/Sanctuary";

export default class WhiteMage extends Role {
    static readonly icon = 'whitemage_icon';
    static readonly roleName = RoleNames.WHITE_MAGE;
    static readonly idleAnimation = 'whitemage_idle';
    static readonly spriteScale = 0.25;

    static readonly healthMultiplier = 3;
    static readonly physicalAttackMultiplier = 4;
    static readonly magicalAttackMultiplier = 2;
    static readonly physicalDefenseMultiplier = 1;
    static readonly magicalDefenseMultiplier = 1;
    static readonly effectRange = EffectRange.One;

    static readonly skills: [number, typeof Skill][] = [
        [1, Attack],
        [2, Heal],
        /*[5, Cure],
        [10, Blessing],
        [15, Resurrection],
        [20, Sanctuary],
        [30, Ragnarok]*/
    ];

    getAvailableSkills(): [number, typeof Skill][] {
        return WhiteMage.skills.filter((skill) => skill[0] <= this.level);
    }
}
