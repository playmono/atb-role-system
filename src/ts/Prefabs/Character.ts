import { Columns, LanePosition, Rows } from "./Enums";
import Role from "./Role";
import Novice from "./Roles/Novice";
import Skill from "./Skill";

export default abstract class Character {
    level: integer;
    role: Role;
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

    skills: Array<Skill>;

    constructor(scene: Phaser.Scene, column: Columns) {
        this.level = 1;
        this.role = new Novice();
        this.lanePosition = LanePosition.FORWARD;

        const oneQuarterX = scene.cameras.main.width / 8;
        const oneThirdY = scene.cameras.main.width / 3;

        // Since the LanePosition is FORWARD, we add/subtract 30px
        const offsetY = this.row === Rows.ABOVE_ROW && column === Columns.FIRST_COLUMN ? 30 : -30;

        this.sprite = scene.add.sprite(
            oneQuarterX * (column * 2 + 1),
            oneThirdY * (this.row * 3 + 1) + offsetY,
            Role.spriteFileName,
            this.role.positionInSpreadsheet
        );

        this.sprite.scale = 2;

        // Novices in spritesheet is looking in the other direction, so flip them if column < 2
        this.sprite.flipX = column < 2;
    }
}
