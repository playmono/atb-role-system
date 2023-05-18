import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Berserk extends Skill {
    static readonly spriteName = "berserk";
    static readonly effectRange = EffectRange.Self;
    static readonly damageType = DamageType.None;
    static readonly areaOfEffect = AreaOfEffect.Single;
}
