import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Attack extends Skill {
    static readonly className = "Attack";
    static readonly spriteName = "attack_icon";
    static readonly effectRange = EffectRange.One;
    static readonly damageType = DamageType.Physical;
    static readonly areaOfEffect = AreaOfEffect.Single;
    static readonly scale = 0.10;
}
