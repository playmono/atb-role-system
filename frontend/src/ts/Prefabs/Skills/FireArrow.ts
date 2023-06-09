import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class FireArrow extends Skill {
    static readonly className = "FireArrow";
    static readonly spriteName = "fire_arrow";
    static readonly effectRange = EffectRange.Two;
    static readonly damageType = DamageType.Magical;
    static readonly areaOfEffect = AreaOfEffect.Single;
    static readonly scale = 0.8;
    static readonly soundEffect: string = 'arrow';
}
