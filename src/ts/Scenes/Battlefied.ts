import { Columns, Rows } from "../Prefabs/Enums";
import Hero from "../Prefabs/Characters/Hero";
import Enemy from "../Prefabs/Characters/Enemy";
import Utilities from "../Utilities";
import Character from "../Prefabs/Character";

export default class BattleField extends Phaser.Scene {
	public static Name = "Battlefield";
	heroGroup: Phaser.GameObjects.Group;
	enemyGroup: Phaser.GameObjects.Group

	public preload(): void {
		// Preload as needed.
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("Battlefield", "create");

		this.enemyGroup = this.add.group({
			defaultKey: 'enemies',
		});

		this.heroGroup = this.add.group({
			defaultKey: 'heros',
		});

		const hero1 = new Hero();
		hero1.render(this, Columns.FIRST_COLUMN);
		this.heroGroup.add(hero1.sprite);

		const hero2 = new Hero();
		hero2.render(this, Columns.SECOND_COLUMN);
		this.heroGroup.add(hero2.sprite);

		const hero3 = new Hero();
		hero3.render(this, Columns.THIRD_COLUMN);
		this.heroGroup.add(hero3.sprite);

		const hero4 = new Hero();
		hero4.render(this, Columns.FOURTH_COLUMN);
		this.heroGroup.add(hero4.sprite);

		const enemy1 = new Enemy();
		enemy1.render(this, Columns.FIRST_COLUMN);
		this.enemyGroup.add(enemy1.sprite);

		const enemy2 = new Enemy();
		enemy2.render(this, Columns.SECOND_COLUMN);
		this.enemyGroup.add(enemy2.sprite);

		const enemy3 = new Enemy();
		enemy3.render(this, Columns.THIRD_COLUMN);
		this.enemyGroup.add(enemy3.sprite);

		const enemy4 = new Enemy();
		enemy4.render(this, Columns.FOURTH_COLUMN);
		this.enemyGroup.add(enemy4.sprite);

		this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
			gameObject.x = dragX;
			gameObject.y = dragY;
		});
	}
}
