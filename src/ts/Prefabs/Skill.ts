import { DamageType, AreaOfEffect, EffectRange } from "./Enums";

export abstract class Skill {
    abstract effectRange: EffectRange;
    abstract damageType: DamageType;
    abstract areaOfEffect: AreaOfEffect;
}
