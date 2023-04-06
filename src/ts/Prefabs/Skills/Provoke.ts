import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Provoke implements Skill {
    readonly effectRange = EffectRange.One;
    readonly damageType = DamageType.None;
    readonly areaOfEffect = AreaOfEffect.Single;
}
