import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Heal extends Skill {
    static readonly className = "Heal";
    static readonly spriteName = "heal";
    static readonly effectRange = EffectRange.One;
    static readonly damageType = DamageType.None;
    static readonly areaOfEffect = AreaOfEffect.Single;
    static readonly scale = 0.5;
    static readonly damage: number = 30;
    static readonly soundEffect: string = 'heal';
}
