import AtbBar from "./AtbBar";
import { Columns, LanePosition, Rows } from "./Enums";
import Role from "./Role";
import Novice from "./Roles/Novice";

export default abstract class Character {
    level: integer;
    currentRole: Role;
    currentRoleType: typeof Role;
    readonly row: Rows;
    lanePosition: LanePosition;
    sprite: Phaser.GameObjects.Sprite;
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

    roles: Array<typeof Role> = [];

    atbBar: AtbBar;

    constructor() {
        this.level = 1;
        this.setRole(Novice);
        this.lanePosition = LanePosition.FORWARD;
        this.atbBar = new AtbBar(this);
    }

    setRole(role: any) {
        const found = this.roles.find((r) => r instanceof role);
        this.currentRole = found ? found :  new role();
        this.currentRoleType = role;
    }

    barReady() {
        // Do nothing
    }

    render(scene: Phaser.Scene, column: Columns): Phaser.GameObjects.Sprite {
        const oneQuarterX = scene.cameras.main.width / 8;
        const oneThirdY = scene.cameras.main.width / 3;

        // Since the LanePosition is FORWARD, we add/subtract 30px
        const offsetY = this.row === Rows.ABOVE_ROW && column === Columns.FIRST_COLUMN ? 30 : -30;

        this.sprite = scene.add.sprite(
            oneQuarterX * (column * 2 + 1),
            oneThirdY * (this.row * 3 + 1) + offsetY,
            this.currentRoleType.spriteFileName,
            this.currentRoleType.positionInSpreadsheet
        );

        this.sprite.scale = 2;

        // Novices in spritesheet is looking in the other direction, so flip them if column < 2
        this.sprite.flipX = column < 2;
        scene.add.text(
            this.sprite.getTopCenter().x,
            this.sprite.getTopCenter().y -30,
            this.level.toString() + "/" + this.currentRole.level.toString()
        );

        this.atbBar.render();

        return this.sprite;
    }
}
