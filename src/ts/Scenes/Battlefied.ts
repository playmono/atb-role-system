import { Columns, Rows } from "../Prefabs/Enums";
import Hero from "../Prefabs/Characters/Hero";
import Enemy from "../Prefabs/Characters/Enemy";
import Utilities from "../Utilities";

export default class BattleField extends Phaser.Scene {
	public static Name = "Battlefield";

	public preload(): void {
		// Preload as needed.
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("Battlefield", "create");

		const hero1 = new Hero(this, Columns.FIRST_COLUMN);
		const hero2 = new Hero(this, Columns.SECOND_COLUMN);
		const hero3 = new Hero(this, Columns.THIRD_COLUMN);
		const hero4 = new Hero(this, Columns.FOURTH_COLUMN);

		const hero5 = new Enemy(this, Columns.FIRST_COLUMN);
		const hero6 = new Enemy(this, Columns.SECOND_COLUMN);
		const hero7 = new Enemy(this, Columns.THIRD_COLUMN);
		const hero8 = new Enemy(this, Columns.FOURTH_COLUMN);
	}
}
