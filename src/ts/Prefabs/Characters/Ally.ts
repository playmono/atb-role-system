import Battlefield from "../../Scenes/Battlefied";
import Character from "../Character";
import { Rows, Columns } from "../Enums";
import AllyQueue from "../Queues/AllyQueue";
import Role from "../Role";
import Novice from "../Roles/Novice";

export default class Ally extends Character {
    scene: Phaser.Scene;
    readonly row = Rows.BELOW_ROW;

    barReady(): void {
        AllyQueue.getQueue().enqueue(this);
    }

    render(scene: Phaser.Scene, column: Columns): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody  {
        super.render(scene, column);
        //this.sprite.setTint(0xa3e0ff);

        return this.sprite;
    }

    startTurn(): void {
        this.renderSkills();
        this.renderRoleIcons();
    }

    renderSkills(): void {
        let y = this.sprite.scene.cameras.main.centerY
        let x = 50;

        this.currentRole.getAvailableSkills().forEach((skill) => {
            const skillType = skill[1];
            const skillObject = new skillType();
            skillObject.render(this.sprite.scene, skillType, x, y);
            x = x + 50;
        });
    }

    renderRoleIcons(): void {
        const oneThirdX = this.sprite.scene.cameras.main.width / 3;

        const y = this.sprite.scene.cameras.main.height - 50;
        const x = this.sprite.scene.cameras.main.centerX;

        const rolesLayout = this.sprite.scene.add.image(
            x,
            y,
            'text_background',
        );
        rolesLayout.scale = 0.35;
        Battlefield.turnElements.add(rolesLayout);

        const currentJobText = this.sprite.scene.add.text(
            oneThirdX / 2,
            rolesLayout.y - 30,
            "Current Job",
            {fontSize: "12px"}
        ).setOrigin(0.5);
        Battlefield.turnElements.add(currentJobText);

        this.currentRole.renderIcon(this, this.currentRole, oneThirdX / 2, y + 10);

        const availableJobsText = this.sprite.scene.add.text(
            oneThirdX * 2,
            y - 30,
            "Available Jobs",
            {fontSize: "12px"}
        ).setOrigin(0.5);
        Battlefield.turnElements.add(availableJobsText);

        const otherRoles = this.getRoles().filter(
            (role: Role) => role !== this.currentRole && !(role instanceof Novice)
        )

        let offsetX = 0;

        for (let i = 0; i < otherRoles.length; i++) {
            offsetX = oneThirdX - 40 + ((oneThirdX * 2) / (otherRoles.length) * (i + 1));
            otherRoles[i].renderIcon(this, otherRoles[i], offsetX, y + 10);
        }
    }

    public holdTurn(): void {
        Battlefield.turnElements.clear(true, true);
        //this.sprite.setTint(0xa3e0ff);
    }

    public endTurn(): void {
        Battlefield.turnElements.clear(true, true);
        //this.sprite.setTint(0xa3e0ff);
        this.atbBar.bar.destroy();
        this.atbBar.render();
    }
}
