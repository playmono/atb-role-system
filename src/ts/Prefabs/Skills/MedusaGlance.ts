import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class MedusaGlance implements Skill {
    readonly effectRange = EffectRange.Two;
    readonly damageType = DamageType.None;
    readonly areaOfEffect = AreaOfEffect.Group;
}
