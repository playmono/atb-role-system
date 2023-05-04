import { EffectRange, RoleNames } from "../Enums";
import Role from "../Role";
import Skill from "../Skill";
import Attack from "../Skills/Attack";

export default class Novice extends Role {
    static readonly icon = 'novice_icon';
    static readonly idleAnimation = 'novice_idle';
    static readonly spriteScale = 0.15;
    static readonly spriteOffsetY = 0;

    static readonly healthMultiplier = 1;
    static readonly physicalAttackMultiplier = 1;
    static readonly magicalAttackMultiplier = 1;
    static readonly physicalDefenseMultiplier = 1;
    static readonly magicalDefenseMultiplier = 1;
    static readonly effectRange = EffectRange.One;

    static readonly skills: [number, typeof Skill][] = [
        [1, Attack]
    ];

    public getAvailableSkills(): [number, typeof Skill][] {
        return Novice.skills.filter((skill) => skill[0] <= this.level);
    }

    render(scene: Phaser.Scene): void {
        /*scene.add.sprite(
            scene.cameras.main.centerX + 100,
            scene.cameras.main.centerY,
            Novice.spriteFileName,
            Novice.positionInSpreadsheet
        );*/
    }
}
