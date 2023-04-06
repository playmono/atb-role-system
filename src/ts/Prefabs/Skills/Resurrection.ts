import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import { Skill } from "../Skill";

export class Resurrection extends Skill {
    effectRange: EffectRange.One;
    damageType: DamageType.None;
    areaOfEffect: AreaOfEffect.Single;
}
