import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import { Skill } from "../Skill";

export class Concentration extends Skill {
    effectRange: EffectRange.Self;
    damageType: DamageType.None;
    areaOfEffect: AreaOfEffect.Single;
}
