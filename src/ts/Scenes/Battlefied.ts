import { Columns, Rows } from "../Prefabs/Enums";
import Hero from "../Prefabs/Hero";
import Utilities from "../Utilities";

export default class BattleField extends Phaser.Scene {
	public static Name = "Battlefield";

	public preload(): void {
		// Preload as needed.
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("Battlefield", "create");

		const hero1 = new Hero(this, Rows.FIRST_ROW, Columns.FIRST_COLUMN);
		const hero2 = new Hero(this, Rows.FIRST_ROW, Columns.SECOND_COLUMN);
		const hero3 = new Hero(this, Rows.FIRST_ROW, Columns.THIRD_COLUMN);
		const hero4 = new Hero(this, Rows.FIRST_ROW, Columns.FOURTH_COLUMN);

		const hero5 = new Hero(this, Rows.SECOND_ROW, Columns.FIRST_COLUMN);
		const hero6 = new Hero(this, Rows.SECOND_ROW, Columns.SECOND_COLUMN);
		const hero7 = new Hero(this, Rows.SECOND_ROW, Columns.THIRD_COLUMN);
		const hero8 = new Hero(this, Rows.SECOND_ROW, Columns.FOURTH_COLUMN);
	}
}
