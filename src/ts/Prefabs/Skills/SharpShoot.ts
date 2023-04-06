import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import { Skill } from "../Skill";

export class SharpShoot extends Skill {
    effectRange: EffectRange.Three;
    damageType: DamageType.Physical;
    areaOfEffect: AreaOfEffect.Single;
}
