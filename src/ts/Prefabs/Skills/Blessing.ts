import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Blessing implements Skill {
    readonly effectRange = EffectRange.One;
    readonly damageType = DamageType.None;
    readonly areaOfEffect = AreaOfEffect.Single;
}
