import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Bash implements Skill {
    readonly effectRange = EffectRange.One;
    readonly damageType = DamageType.Physical;
    readonly areaOfEffect = AreaOfEffect.Single;
}
