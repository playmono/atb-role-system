import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class SpiritualMind extends Skill {
    static readonly className = "SpiritualMind";
    static readonly spriteName = "spiritual_mind";
    static readonly effectRange = EffectRange.Self;
    static readonly damageType = DamageType.None;
    static readonly areaOfEffect = AreaOfEffect.Single;
}
