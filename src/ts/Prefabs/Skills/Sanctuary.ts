import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Sanctuary implements Skill {
    readonly effectRange = EffectRange.One;
    readonly damageType = DamageType.None;
    readonly areaOfEffect = AreaOfEffect.Group;
}
