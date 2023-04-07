import { DamageType, AreaOfEffect, EffectRange } from "./Enums";

export default abstract class Skill {
    static readonly spriteName = "sword";
    static readonly effectRange: EffectRange;
    static readonly damageType: DamageType;
    static readonly areaOfEffect: AreaOfEffect;
}
