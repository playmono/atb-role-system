import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import { Skill } from "../Skill";

export class AnkleTrap extends Skill {
    effectRange: EffectRange.Two;
    damageType: DamageType.None;
    areaOfEffect: AreaOfEffect.Single;
}
