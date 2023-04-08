import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class ArrowVulcan extends Skill {
    static readonly spriteName = "sword";
    static readonly effectRange = EffectRange.Two;
    static readonly damageType = DamageType.Physical;
    static readonly areaOfEffect = AreaOfEffect.Group;
}
