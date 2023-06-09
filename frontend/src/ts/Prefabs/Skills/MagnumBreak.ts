import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class MagnumBreak extends Skill {
    static readonly className = "MagnumBreak";
    static readonly spriteName = "sword";
    static readonly effectRange = EffectRange.One;
    static readonly damageType = DamageType.None;
    static readonly areaOfEffect = AreaOfEffect.Row;
}
