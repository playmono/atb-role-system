import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Concentration extends Skill {
    static readonly className = "Concentration";
    static readonly spriteName = "concentration";
    static readonly effectRange = EffectRange.Self;
    static readonly damageType = DamageType.None;
    static readonly areaOfEffect = AreaOfEffect.Single;
}
