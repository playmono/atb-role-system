import { EffectRange } from "./Enums";
import { Skill } from "./Skill";

export abstract class Role {
    abstract healthMultiplier: integer;
    abstract physicalAttackMultiplier: integer;
    abstract magicalAttackMultiplier: integer;
    abstract physicalDefenseMultiplier: integer;
    abstract magicalDefenseMultiplier: integer;
    abstract effectRange: EffectRange;
    abstract skills: [Skill, integer][];
}
