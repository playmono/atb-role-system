import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class FireBolt extends Skill {
    static readonly className = "FireBolt";
    static readonly spriteName = "fire_bolt";
    static readonly effectRange = EffectRange.Two;
    static readonly damageType = DamageType.Magical;
    static readonly areaOfEffect = AreaOfEffect.Single;
    static readonly scale = 0.5;
    static readonly damage = -30;
}
