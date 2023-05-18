import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class FireArrow extends Skill {
    static readonly spriteName = "fire_arrow";
    static readonly effectRange = EffectRange.Two;
    static readonly damageType = DamageType.Magical;
    static readonly areaOfEffect = AreaOfEffect.Single;
    static readonly scale = 0.8;
}
