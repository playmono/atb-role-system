import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class LordOfVermillion implements Skill {
    static readonly spriteName = "sword";
    static readonly effectRange = EffectRange.Two;
    static readonly damageType = DamageType.Magical;
    static readonly areaOfEffect = AreaOfEffect.Group;
}
