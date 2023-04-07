import { AreaOfEffect, DamageType, EffectRange } from "../Enums";
import Skill from "../Skill";

export default class SharpShoot implements Skill {
    static readonly spriteName = "sword";
    static readonly effectRange = EffectRange.Three;
    static readonly damageType = DamageType.Physical;
    static readonly areaOfEffect = AreaOfEffect.Single;
}
