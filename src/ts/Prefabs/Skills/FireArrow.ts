import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import { Skill } from "../Skill";

export class FireArrow extends Skill {
    effectRange: EffectRange.Two;
    damageType: DamageType.Magical;
    areaOfEffect: AreaOfEffect.Single;
}
