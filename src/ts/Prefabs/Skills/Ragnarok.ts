import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Ragnarok implements Skill {
    static readonly spriteName = "sword";
    static readonly effectRange = EffectRange.Three;
    static readonly damageType = DamageType.None;
    static readonly areaOfEffect = AreaOfEffect.Group;
}
