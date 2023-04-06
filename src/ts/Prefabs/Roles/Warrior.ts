import { EffectRange, RoleNames } from "../Enums";
import Role from "../Role";
import Bash from "../Skills/Bash";
import Berserk from "../Skills/Berserk";
import MagnumBreak from "../Skills/MagnumBreak";
import Protection from "../Skills/Protection";
import Provoke from "../Skills/Provoke";
import Ragnarok from "../Skills/Ragnarok";

export default class Warrior implements Role {
    readonly roleName = RoleNames.WARRIOR;
    readonly positionInSpreadsheet = 2;
    readonly healthMultiplier = 3;
    readonly physicalAttackMultiplier = 4;
    readonly magicalAttackMultiplier = 2;
    readonly physicalDefenseMultiplier = 1;
    readonly magicalDefenseMultiplier = 1;
    readonly effectRange = EffectRange.One;

    readonly skills: [number, string][] = [
        [2, Bash.name],
        [5, Provoke.name],
        [10, Protection.name],
        [15, Berserk.name],
        [20, MagnumBreak.name],
        [30, Ragnarok.name]
    ];
}
