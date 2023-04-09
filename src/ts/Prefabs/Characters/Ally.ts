import Battlefield from "../../Scenes/Battlefied";
import Character from "../Character";
import { RolesMap } from "../Constants";
import { Rows, Columns } from "../Enums";
import AllyQueue from "../Queues/AllyQueue";
import Novice from "../Roles/Novice";

export default class Ally extends Character {
    scene: Phaser.Scene;
    readonly row = Rows.BELOW_ROW;

    barReady() {
        AllyQueue.getQueue().enqueue(this);
    }

    render(scene: Phaser.Scene, column: Columns): Phaser.GameObjects.Sprite  {
        super.render(scene, column);
        this.sprite.setTint(0xa3e0ff);

        this.sprite.on('endTurn', this.endTurn, this);

        return this.sprite;
    }

    startTurn(): void {
        this.sprite.setTint(0xfbff17);

        this.currentRole.getAvailableSkills().forEach((skill) => {
            const skillObject = new skill[1]();
            skillObject.render(this.sprite.scene);
        });

        let x = this.sprite.scene.cameras.main.centerX - 50;

        if (this.level >= 2) {
            for (const role of Object.values(this.roles)) {
                const roleType = Object.values(RolesMap).find((r) => role instanceof r);

                if (roleType === Novice) {
                    continue;
                }

                role.render(this.sprite.scene, roleType, x, this.sprite.scene.cameras.main.centerY + this.sprite.scene.cameras.main.centerY - 100);
                x = x + 50;
            }
        }
    }

    endTurn(): void {
        Battlefield.turnElements.clear(true, true);
        this.levelUp();
        this.sprite.setTint(0xa3e0ff);
        this.atbBar.progressBar.destroy();
        this.atbBar.render();
    }
}
