import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class AnkleTrap extends Skill {
    static readonly spriteName = "ankle_trap";
    static readonly effectRange = EffectRange.Two;
    static readonly damageType = DamageType.None;
    static readonly areaOfEffect = AreaOfEffect.Single;
}
