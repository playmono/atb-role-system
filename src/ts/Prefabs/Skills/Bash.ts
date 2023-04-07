import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Bash implements Skill {
    static readonly spriteName = "sword";
    static readonly effectRange = EffectRange.One;
    static readonly damageType = DamageType.Physical;
    static readonly areaOfEffect = AreaOfEffect.Single;
}
