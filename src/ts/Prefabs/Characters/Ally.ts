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
            const sprite = skillObject.render(skillType, skillLevel, circumferencePoint.x, circumferencePoint.y);

            this.turnElements.add(sprite);
        }
    }

    renderRoleIcons(): void {
        const offsetCircle = this.currentRoleType == Archer ? 45 : 35;
        const y = this.sprite.getBottomCenter().y + offsetCircle;
        const x = this.sprite.getBottomCenter().x - 25;

        const otherRoles = this.getRoles().filter(
            (role: Role) => role !== this.currentRole && !(role instanceof Novice)
        )

        let offsetY = 10;

        for (let i = 0; i < otherRoles.length; i++) {
            let offsetX = 0;

            if (i % 2 !== 0) {
                offsetX = 45;
            }

            const icon = otherRoles[i].renderIcon(this, otherRoles[i], x + offsetX, y + offsetY, this.turnElements);

            const roleType = Object.values(RolesMap).find((r) => otherRoles[i] instanceof r);

            let radar = null;

            icon.on('pointerdown', (pointer) => {
                radar = this.sprite.scene.add.sprite(
                    this.sprite.getCenter().x,
                    this.sprite.getCenter().y,
                    '',
                );
                radar.scale = 0.3;
                radar.setTint(roleType.hexColor);
                radar.anims.play('radar');

                radar.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
                    //this.sprite.scene.sound.play('changerole');
                    this.currentRole.destroy();
                    this.setRole(roleType);
                    this.renderRole(this.sprite.scene);
                    this.endTurn();
                    radar.destroy();
                });
            });

            icon.on('pointerup', (pointer) => {
                radar.destroy();
            })

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

    public endTurn(): void {
        this.atbBar.bar.destroy();
        this.atbBar.render();
        this.turnElements.clear(true, true);
    }
}
