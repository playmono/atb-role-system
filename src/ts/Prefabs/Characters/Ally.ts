import Battlefield from "../../Scenes/Battlefied";
import Character from "../Character";
import { Rows, Columns } from "../Enums";
import AllyQueue from "../Queues/AllyQueue";

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

        if (this.level >= 2) {
            this.roles.forEach((role) => role.render(this.sprite.scene));
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
