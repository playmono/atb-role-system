import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Dispel extends Skill {
    static readonly spriteName = "dispel";
    static readonly effectRange = EffectRange.One;
    static readonly damageType = DamageType.None;
    static readonly areaOfEffect = AreaOfEffect.Single;
}
