import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import { Skill } from "../Skill";

export class ArrowVulcan extends Skill {
    range: EffectRange.Two;
    damageType: DamageType.Physical;
    areaOfEffect: AreaOfEffect.Group;
}
