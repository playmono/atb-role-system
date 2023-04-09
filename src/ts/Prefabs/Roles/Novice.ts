import { EffectRange, RoleNames } from "../Enums";
import Role from "../Role";
import Skill from "../Skill";
import Attack from "../Skills/Attack";

export default class Novice extends Role {
    level: number = 1;
    static readonly spriteFileName = "tileset";
    static readonly roleName = RoleNames.NOVICE;
    static readonly positionInSpreadsheet =7;
    static readonly healthMultiplier = 1;
    static readonly physicalAttackMultiplier = 1;
    static readonly magicalAttackMultiplier = 1;
    static readonly physicalDefenseMultiplier = 1;
    static readonly magicalDefenseMultiplier = 1;
    static readonly effectRange = EffectRange.One;

    static readonly skills: [number, typeof Skill][] = [
        [1, Attack]
    ];

    getAvailableSkills() {
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
