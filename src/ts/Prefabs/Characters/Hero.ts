import Character from "../Character";
import { Rows, Columns } from "../Enums";

export default class Hero extends Character {
    readonly row: Rows.BELOW_ROW;

    constructor(scene: Phaser.Scene, column: Columns) {
        super(scene, column);
        this.sprite.setTint(0xa3e0ff);
    }
}
