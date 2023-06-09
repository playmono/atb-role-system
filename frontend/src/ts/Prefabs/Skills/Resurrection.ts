import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Resurrection extends Skill {
    static readonly className = "Resurrection";
    static readonly spriteName = "resurrection";
    static readonly effectRange = EffectRange.One;
    static readonly damageType = DamageType.None;
    static readonly areaOfEffect = AreaOfEffect.Single;
}
