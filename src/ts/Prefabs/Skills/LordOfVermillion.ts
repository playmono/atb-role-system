import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import { Skill } from "../Skill";

export class LordOfVermillion extends Skill {
    effectRange: EffectRange.Two;
    damageType: DamageType.Magical;
    areaOfEffect: AreaOfEffect.Group;
}
