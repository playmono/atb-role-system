import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class AnkleTrap implements Skill {
    static readonly spriteName = "sword";
    static readonly effectRange = EffectRange.Two;
    static readonly damageType = DamageType.None;
    static readonly areaOfEffect = AreaOfEffect.Single;
}
