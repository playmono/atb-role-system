import Character from "../Character";
import { Rows, Columns } from "../Enums";

export default class Hero extends Character {
    readonly row = Rows.BELOW_ROW;

    render(scene: Phaser.Scene, column: Columns): Phaser.GameObjects.Sprite  {
        super.render(scene, column);
        this.sprite.setTint(0xa3e0ff);

        return this.sprite;
    }
}
