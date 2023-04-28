import Battlefield from "../../Scenes/Battlefied";
import Character from "../Character";
import { RolesMap } from "../Constants";
import { Rows, Columns } from "../Enums";
import AllyQueue from "../Queues/AllyQueue";
import Novice from "../Roles/Novice";

export default class Ally extends Character {
    scene: Phaser.Scene;
    readonly row = Rows.BELOW_ROW;

    barReady(): void {
        AllyQueue.getQueue().enqueue(this);
    }

    render(scene: Phaser.Scene, column: Columns): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody  {
        super.render(scene, column);
        this.sprite.setTint(0xa3e0ff);

        return this.sprite;
    }

    startTurn(): void {
        this.sprite.setTint(0xfbff17);
        this.renderSkills();
        this.renderRoles();
    }

    renderSkills() {
        let y = this.sprite.scene.cameras.main.centerY
        let x = 50;

        this.currentRole.getAvailableSkills().forEach((skill) => {
            const skillType = skill[1];
            const skillObject = new skillType();
            skillObject.render(this.sprite.scene, skillType, x, y);
            x = x + 50;
        });
    }

    renderRoles() {
        const y = this.sprite.scene.cameras.main.centerY;
        let x = this.sprite.scene.cameras.main.centerX;

        if (this.level >= 2) {
            Object.values(this.roles).forEach((role) => {
                const roleType = Object.values(RolesMap).find((r) => role instanceof r);

                if (roleType === Novice) {
                    return;
                }

                role.render(this.sprite.scene, roleType, x, y);
                x = x + 50;
            });
        }
    }

    public holdTurn(): void {
        Battlefield.turnElements.clear(true, true);
        this.sprite.setTint(0xa3e0ff);
    }

    public endTurn(): void {
        Battlefield.turnElements.clear(true, true);
        this.sprite.setTint(0xa3e0ff);
        this.atbBar.bar.destroy();
        this.atbBar.render();
    }
}
