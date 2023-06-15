import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class StoneCurse extends Skill {
    static readonly className = "StoneCurse";
    static readonly spriteName = "stone_curse";
    static readonly effectRange = EffectRange.Two;
    static readonly damageType = DamageType.None;
    static readonly areaOfEffect = AreaOfEffect.Group;
}
