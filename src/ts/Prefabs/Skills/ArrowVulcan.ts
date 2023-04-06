import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class ArrowVulcan implements Skill {
    readonly effectRange = EffectRange.Two;
    readonly damageType = DamageType.Physical;
    readonly areaOfEffect = AreaOfEffect.Group;
}
