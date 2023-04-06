import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class SpiritualMind implements Skill {
    readonly effectRange = EffectRange.Self;
    readonly damageType = DamageType.None;
    readonly areaOfEffect = AreaOfEffect.Single;
}
