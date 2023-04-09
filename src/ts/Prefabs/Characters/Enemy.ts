import Character from "../Character";
import { Rows, Columns } from "../Enums";

export default class Enemy extends Character {
    readonly row = Rows.ABOVE_ROW;

    render(scene: Phaser.Scene, column: Columns): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        super.render(scene, column);
        this.sprite.setTint(0xff8b87);

        return this.sprite;
    }
}
