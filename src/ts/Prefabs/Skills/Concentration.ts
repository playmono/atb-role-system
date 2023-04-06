import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Concentration implements Skill {
    readonly effectRange = EffectRange.Self;
    readonly damageType = DamageType.None;
    readonly areaOfEffect = AreaOfEffect.Single;
}
