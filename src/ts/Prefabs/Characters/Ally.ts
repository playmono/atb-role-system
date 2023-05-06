import Battlefield from "../../Scenes/Battlefied";
import Character from "../Character";
import { RolesMap } from "../Constants";
import { Rows, Columns } from "../Enums";
import AllyQueue from "../Queues/AllyQueue";
import Role from "../Role";
import Novice from "../Roles/Novice";

export default class Ally extends Character {
    scene: Phaser.Scene;
    readonly row = Rows.BELOW_ROW;
    turnElements: Phaser.Physics.Arcade.Group;

    barReady(): void {
        this.startTurn();
        //AllyQueue.getQueue().enqueue(this);
    }

    render(scene: Phaser.Scene, column: Columns): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody  {
        super.render(scene, column);
        this.turnElements = this.sprite.scene.physics.add.group();
        return this.sprite;
    }

    renderSkills(): void {
        let x = this.sprite.getTopCenter().x;
        let y = this.sprite.getTopCenter().y - 30;

        this.currentRole.getAvailableSkills().forEach((skill) => {
            const skillType = skill[1];
            const skillObject = new skillType();
            const sprite = skillObject.render(this.sprite.scene, skillType, x, y);
            this.turnElements.add(sprite);
            x = x + 50;
        });
    }

    renderRoleIcons(): void {
        const y = this.sprite.getBottomCenter().y + 35;
        const x = this.sprite.getBottomCenter().x - 20;

        const otherRoles = this.getRoles().filter(
            (role: Role) => role !== this.currentRole && !(role instanceof Novice)
        )

        let offsetY = 0;

        for (let i = 0; i < otherRoles.length; i++) {
            let offsetX = 0;

            if (i % 2 !== 0) {
                offsetX = 35;
            }

            const icon = otherRoles[i].renderIcon(this, otherRoles[i], x + offsetX, y + offsetY, this.turnElements);

            const roleType = Object.values(RolesMap).find((r) => otherRoles[i] instanceof r);

            icon.on('pointerdown', (pointer) => {
                this.setRole(roleType);
                this.renderRole(this.sprite.scene);
                this.endTurn();
            });

            if (i % 2 !== 0) {
                offsetY += 35;
            }
        }
    }

    startTurn(): void {
        this.renderSkills();
        this.renderRoleIcons();
    }

    public endTurn(): void {
        //Battlefield.turnElements.clear(true, true);
        //this.sprite.setTint(0xa3e0ff);
        this.atbBar.bar.destroy();
        this.atbBar.render();
        this.turnElements.clear(true, true);
    }
}
