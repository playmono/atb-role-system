import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class ArrowVulcan extends Skill {
    static readonly className = "ArrowVulcan";
    static readonly spriteName = "arrow_vulcan";
    static readonly effectRange = EffectRange.Two;
    static readonly damageType = DamageType.Physical;
    static readonly areaOfEffect = AreaOfEffect.Group;
}
