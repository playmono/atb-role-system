import Battlefield from "../Scenes/Battlefied";
import { EffectRange, RoleNames } from "./Enums";
import AllyQueue from "./Queues/AllyQueue";
import Skill from "./Skill";

export default abstract class Role {
    level: number = 1;
    static readonly roleName: RoleNames;
    static readonly spriteFileName = "tileset";
    static readonly positionInSpreadsheet: number;
    static readonly healthMultiplier: number;
    static readonly physicalAttackMultiplier: number;
    static readonly magicalAttackMultiplier: number;
    static readonly physicalDefenseMultiplier: number;
    static readonly magicalDefenseMultiplier: number;
    static readonly effectRange: EffectRange;
    static readonly skills: [number, typeof Skill][];

    getAvailableSkills() {
        return Role.skills.filter((skill) => skill[0] <= this.level);
    }

    render(scene: Phaser.Scene, roleType: any, x: number, y: number): void {
        const sprite = scene.add.sprite(
            x,
            y,
            roleType.spriteFileName,
            roleType.positionInSpreadsheet
        ).setInteractive();

        Battlefield.turnElements.add(sprite);

        const currentAlly = AllyQueue.getQueue().getFirst();

        if (currentAlly.currentRoleType === roleType) {
            sprite.setTint(0x2b2b2b);
        } else {
            sprite.on('pointerdown', function(pointer) {
                const currentAlly = AllyQueue.getQueue().getFirst();
                currentAlly.setRole(roleType);
                currentAlly.renderRole(scene);
                AllyQueue.getQueue().nextTurn();
            });

            const text = scene.add.text(
                sprite.getBottomCenter().x - 10,
                sprite.getBottomCenter().y,
                "Lv. " + this.level,
                {fontSize: "10"}
            );

            Battlefield.turnElements.add(text);
        }
    }
}
