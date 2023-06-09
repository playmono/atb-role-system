import Character from "../Character";
import { RolesMap } from "../Constants";
import { Rows, Columns } from "../Enums";
import Role from "../Role";
import Archer from "../Roles/Archer";
import Novice from "../Roles/Novice";

export default class Ally extends Character {
    scene: Phaser.Scene;
    readonly row = Rows.BELOW_ROW;
    turnElements: Phaser.Physics.Arcade.Group;

    barReady(): void {
        this.startTurn();
    }

    render(scene: Phaser.Scene, column: Columns): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody  {
        super.render(scene, column);
        this.turnElements = this.sprite.scene.physics.add.group();
        return this.sprite;
    }

    renderSkills(): void {
        let angle = - Math.PI / 2;

        const skills = this.currentRoleType.skills;

        for (let i = 0; i < skills.length; i++) {
            const skillLevel = skills[i][0];
            const skillType = skills[i][1];
            const skillObject = new skillType(this);

            const difference = i * Math.PI * 1.15 / 4;
            angle = i % 2 === 0 ? angle += difference : angle -= difference;
            const circumferencePoint = Phaser.Geom.Circle.CircumferencePoint(this.topCircle, angle);
            const sprite = skillObject.renderAllySkill(skillType, skillLevel, circumferencePoint.x, circumferencePoint.y);

            this.turnElements.add(sprite);
        }
    }

    renderRoleIcons(): void {
        const offsetCircle = this.currentRoleType == Archer ? 45 : 35;
        const y = this.sprite.getBottomCenter().y + offsetCircle;
        const x = this.sprite.getBottomCenter().x - 25;

        const otherRoles = this.getRoles().filter(
            (role: Role) => role !== this.currentRole && !(role instanceof Novice)
        );

        let offsetY = 10;

        for (let i = 0; i < otherRoles.length; i++) {
            let offsetX = 0;

            if (i % 2 !== 0) {
                offsetX = 45;
            }

            const icon = otherRoles[i].renderIconForAlly(this, otherRoles[i], x + offsetX, y + offsetY, this.turnElements);

            if (i % 2 !== 0) {
                offsetY += 45;
            }
        }
    }

    startTurn(): void {
        this.renderSkills();

        if (this.level > 1) {
            this.renderRoleIcons();
        }
    }

    public endTurn(keepTurn: boolean): void {
        // We have to stop emitters manually
        const otherRoles = this.getRoles().filter(
            (role: Role) => role !== this.currentRole && !(role instanceof Novice) && role.emitter !== undefined
        );
        otherRoles.forEach((otherRole) => {
            otherRole.emitter.stop();
        });
        this.atbBar.bar.destroy();

        if (keepTurn) {
            this.atbBar.render();
        }

        this.turnElements.clear(true, true);
    }
}
