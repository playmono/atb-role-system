import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import { Skill } from "../Skill";

export class Bash extends Skill {
    effectRange: EffectRange.One;
    damageType: DamageType.Physical;
    areaOfEffect: AreaOfEffect.Single;
}
