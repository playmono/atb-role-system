import { DamageType, AreaOfEffect, EffectRange } from "./Enums";

export default interface Skill {
    effectRange: EffectRange;
    damageType: DamageType;
    areaOfEffect: AreaOfEffect;
}
