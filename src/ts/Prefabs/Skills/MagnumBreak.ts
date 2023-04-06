import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import { Skill } from "../Skill";

export class MagnumBreak extends Skill {
    effectRange: EffectRange.One;
    damageType: DamageType.None;
    areaOfEffect: AreaOfEffect.Row;
}
