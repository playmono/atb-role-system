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

        const oneQuarterX = scene.cameras.main.width / 8;
        const oneThirdY = scene.cameras.main.width / 3;

        const offsetY = this.row === Rows.BELOW_ROW ? -30 : 0;

        this.sprite = scene.physics.add.sprite(
            oneQuarterX * (column * 2 + 1),
            oneThirdY * (this.row * 3 + 1) + offsetY,
            ''
        ).setInteractive();

        this.sprite.play(this.gender > 0.5 ? 'novice_boy_idle' : 'novice_girl_idle');

        this.sprite['__parentClass'] = this;
        this.sprite.body.setSize(150, 370);
        this.sprite.scale = 0.15;

        // Novices in spritesheet are looking in the other direction, so flip them if column < 2
        this.sprite.flipX = column > 1;

        this.levelsText = scene.add.text(
            this.sprite.getTopCenter().x - 10,
            this.sprite.getTopCenter().y - 30,
            ''
        );
        this.updateLevelsText();

        this.healthBar.render();
        this.atbBar.render();

        return this.sprite;
    }

    renderRole(scene: Phaser.Scene) {
        this.sprite.anims.play(this.currentRoleType.idleAnimation);
        this.sprite.scale = this.currentRoleType.spriteScale;

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
