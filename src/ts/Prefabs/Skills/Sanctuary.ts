import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import { Skill } from "../Skill";

export class Sanctuary extends Skill {
    effectRange: EffectRange.One;
    damageType: DamageType.None;
    areaOfEffect: AreaOfEffect.Group;
}
