import Character from "../Character";
import { Rows, Columns } from "../Enums";

export default class Enemy extends Character {
    readonly row: Rows.ABOVE_ROW;

    constructor(scene: Phaser.Scene, column: Columns) {
        super(scene, column);
        this.sprite.setTint(0xff8b87);
    }
}
