import AtbBar from "./AtbBar";
import { RolesMap } from "./Constants";
import { Columns, LanePosition, RoleNames, Rows } from "./Enums";
import Role from "./Role";
import Novice from "./Roles/Novice";

export default abstract class Character {
    level: integer;
    currentRole: Role;
    currentRoleType: typeof Role;
    readonly row: Rows;
    column: Columns;
    lanePosition: LanePosition;
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    health: {
        current: integer,
        max: integer,
    };
    attack: {
        physical: integer,
        magical: integer,
    };
    defense: {
        physical: integer,
        magical: integer,
    };

    roles: Array<Role> = [];

    atbBar: AtbBar;
    levelsText: Phaser.GameObjects.Text;

    constructor() {
        this.level = 1;
        this.lanePosition = LanePosition.FORWARD;
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

    barReady() {
        // Do nothing
    }

    render(scene: Phaser.Scene, column: Columns): Phaser.GameObjects.Sprite {
        this.column = column;

        const oneQuarterX = scene.cameras.main.width / 8;
        const oneThirdY = scene.cameras.main.width / 3;

        const offsetY = this.row === Rows.BELOW_ROW ? -30 : 0;

        this.sprite = scene.physics.add.sprite(
            oneQuarterX * (column * 2 + 1),
            oneThirdY * (this.row * 3 + 1) + offsetY,
            this.currentRoleType.spriteFileName,
            this.currentRoleType.positionInSpreadsheet
        );

        this.sprite.body.setCircle(15, 15);
        this.sprite.body.setOffset(0, 0);
        this.sprite.scale = 2;

        // Novices in spritesheet is looking in the other direction, so flip them if column < 2
        this.sprite.flipX = column > 1;

        this.levelsText = scene.add.text(
            this.sprite.getTopCenter().x - 10,
            this.sprite.getTopCenter().y - 30,
            ''
        );
        this.updateLevelsText();

        this.atbBar.render();

        return this.sprite;
    }

    renderRole(scene: Phaser.Scene) {
        this.sprite.setTexture(
            this.currentRoleType.spriteFileName,
            this.currentRoleType.positionInSpreadsheet
        );
    }

    protected updateLevelsText(): void {
        this.levelsText.setText(this.level.toString() + "/" + this.currentRole.level.toString());
    }

    protected levelUp(): void {
        this.level++;
        this.currentRole.level++;
        this.updateLevelsText();
    }
}
