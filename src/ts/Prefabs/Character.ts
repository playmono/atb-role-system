import { RolesMap } from "./Constants";
import { Columns, LanePosition, Rows } from "./Enums";
import HealthBar from "./Bars/HealthBar";
import AtbBar from "./Bars/AtbBar";
import Role from "./Role";
import Novice from "./Roles/Novice";

export default abstract class Character {
    level: number = 1;
    currentRole: Role;
    currentRoleType: typeof Role;
    readonly row: Rows;
    column: Columns;
    lanePosition: LanePosition = LanePosition.FORWARD;
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    healthCurrent: number = 100;
    healthMax: number = 100;
    attackPhysical: number = 10;
    attackMagical: number = 7;
    defensePhysical: number = 4;
    defenseMagical: number = 2;

    private roles: Array<Role> = [];

    healthBar: HealthBar;
    atbBar: AtbBar;
    levelsText: Phaser.GameObjects.Text;
    gender: number;
    roleIcon: Phaser.GameObjects.Sprite;

    constructor() {
        this.gender = Math.random();
        this.healthBar = new HealthBar(this);
        this.atbBar = new AtbBar(this);
        this.setRole(Novice);

        for (const roleName in RolesMap) {
            this.roles.push(new RolesMap[roleName]());
        }
    }

    setRole(roleType: any) {
        const found = this.getRole(roleType);
        this.currentRole = found;
        this.currentRoleType = roleType;
    }

    getRole(roleType: any): any {
        const found = this.roles.find((r) => r instanceof roleType);

        if (found) {
            return found;
        }

        const role = new roleType();
        this.roles.push(role);
        return role;
    }

    getRoles(): Array<Role> {
        return this.roles;
    }

    barReady() {
        // Do nothing
    }

    render(scene: Phaser.Scene, column: Columns): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        this.column = column;

        this.sprite = scene.physics.add.sprite(0, 0, '')
            .setOrigin(0.5)
            .setInteractive();

        // Novices in spritesheet are looking in the other direction, so flip them if column < 2
        this.sprite.flipX = column > 1;

        this.sprite['__parentClass'] = this;
        this.sprite.body.setSize(150, 370);

        this.levelsText = scene.add.text(
            this.sprite.getTopCenter().x - 10,
            this.sprite.getTopCenter().y - 30,
            ''
        );

        this.renderRole(scene);
        this.healthBar.render();
        this.atbBar.render();

        this.updateLevelsText();

        return this.sprite;
    }

    renderRole(scene: Phaser.Scene) {
        const idleAnimation = this.currentRoleType === Novice ?
            this.gender > 0.5 ? 'novice_boy_idle' : 'novice_girl_idle'
            : this.currentRoleType.idleAnimation;

        this.sprite.anims.play(idleAnimation);
        this.sprite.scale = this.currentRoleType.spriteScale;

        const oneThirdY = scene.cameras.main.width / 3;
        const oneQuarterX = scene.cameras.main.width / 6;

        const offsetY = this.row === Rows.BELOW_ROW ? -30 : 0;

        this.sprite.x = oneQuarterX * (this.column * 2 + 1);
        this.sprite.y = oneThirdY * (this.row * 3 + 1) + offsetY + this.currentRoleType.spriteOffsetY;

        if (this.roleIcon === undefined) {
            this.roleIcon = this.currentRole.renderIcon(
                this,
                this.currentRole,
                this.sprite.getTopCenter().x,
                this.sprite.getTopCenter().y + 10
            );
        } else {
            this.roleIcon.setTexture(this.currentRoleType.icon);
        }

        this.updateLevelsText();
    }

    protected updateLevelsText(): void {
        this.levelsText.setText(this.level.toString() + "/" + this.currentRole.level.toString());
    }

    public levelUp(): void {
        this.level++;
        this.currentRole.level++;
        this.updateLevelsText();
    }

    protected receiveSkill(damage: number): void {
        const anim = this.sprite.play(this.gender > 0.5 ? 'novice_boy_hurt' : 'novice_girl_hurt');

        this.sprite.on(
            Phaser.Animations.Events.ANIMATION_COMPLETE,
            () => this.sprite.play(this.gender > 0.5 ? 'novice_boy_idle' : 'novice_girl_idle'),
            this
        );

        let result = this.healthCurrent + damage;

        if (result <= 0) {
            this.die();
        }

        if (result > this.healthMax) {
            result = this.healthMax
        }

        this.healthCurrent = result;
        this.healthBar.update();
    }

    protected die(): void {
        this.sprite.destroy();
        this.levelsText.destroy();
        this.atbBar.bar.destroy();
        this.atbBar.progressBox.destroy();
        this.healthBar.bar.destroy();
    }
}
