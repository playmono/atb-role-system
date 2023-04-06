import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class SharpShoot implements Skill {
    readonly effectRange = EffectRange.Three;
    readonly damageType = DamageType.Physical;
    readonly areaOfEffect = AreaOfEffect.Single;
}
