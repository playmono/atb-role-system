import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import { Skill } from "../Skill";

export class MedusaGlance extends Skill {
    effectRange: EffectRange.Two;
    damageType: DamageType.None;
    areaOfEffect: AreaOfEffect.Group;
}
