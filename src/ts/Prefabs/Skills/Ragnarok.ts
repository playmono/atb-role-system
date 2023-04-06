import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class Ragnarok implements Skill {
    readonly effectRange = EffectRange.Three;
    readonly damageType = DamageType.None;
    readonly areaOfEffect = AreaOfEffect.Group;
}
