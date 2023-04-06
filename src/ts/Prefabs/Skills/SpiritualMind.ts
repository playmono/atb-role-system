import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import { Skill } from "../Skill";

export class SpiritualMind extends Skill {
    effectRange: EffectRange.Self;
    damageType: DamageType.None;
    areaOfEffect: AreaOfEffect.Single;
}
