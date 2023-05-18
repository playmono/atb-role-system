import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Bash extends Skill {
    static readonly spriteName = "bash";
    static readonly effectRange = EffectRange.One;
    static readonly damageType = DamageType.Physical;
    static readonly areaOfEffect = AreaOfEffect.Single;
    static readonly scale = 1;
}
