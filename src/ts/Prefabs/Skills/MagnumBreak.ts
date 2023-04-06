import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class MagnumBreak implements Skill {
    readonly effectRange = EffectRange.One;
    readonly damageType = DamageType.None;
    readonly areaOfEffect = AreaOfEffect.Row;
}
