import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class FireBolt implements Skill {
    readonly effectRange = EffectRange.Two;
    readonly damageType = DamageType.Magical;
    readonly areaOfEffect = AreaOfEffect.Single;
}
