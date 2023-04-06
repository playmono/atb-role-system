import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import { Skill } from "../Skill";

export class Ragnarok extends Skill {
    effectRange: EffectRange.Three;
    damageType: DamageType.None;
    areaOfEffect: AreaOfEffect.Group;
}
