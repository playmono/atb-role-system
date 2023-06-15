import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class LordOfVermillion extends Skill {
    static readonly className = "LordOfVermillion";
    static readonly spriteName = "lord_of_vermillion";
    static readonly effectRange = EffectRange.Two;
    static readonly damageType = DamageType.Magical;
    static readonly areaOfEffect = AreaOfEffect.Group;
}
