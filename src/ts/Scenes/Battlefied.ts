import { Columns, Rows } from "../Prefabs/Enums";
import Hero from "../Prefabs/Characters/Ally";
import Enemy from "../Prefabs/Characters/Enemy";
import Utilities from "../Utilities";

export default class Battlefield extends Phaser.Scene {
	public static Name = "Battlefield";
	static allyGroup: Phaser.GameObjects.Group;
	static enemyGroup: Phaser.GameObjects.Group;
	static turnElements: Phaser.GameObjects.Group;

	public preload(): void {
		// Preload as needed.
	}

	public create(): void {
		Utilities.LogSceneMethodEntry("Battlefield", "create");

		Battlefield.enemyGroup = this.physics.add.group();
		Battlefield.allyGroup = this.physics.add.group();
		Battlefield.turnElements = this.physics.add.group();

		const hero1 = new Hero()
		hero1.render(this, Columns.FIRST_COLUMN);
		Battlefield.allyGroup.add(hero1.sprite);

		const hero2 = new Hero();
		hero2.render(this, Columns.SECOND_COLUMN);
		Battlefield.allyGroup.add(hero2.sprite);

		const hero3 = new Hero();
		hero3.render(this, Columns.THIRD_COLUMN);
		Battlefield.allyGroup.add(hero3.sprite);

		const hero4 = new Hero();
		hero4.render(this, Columns.FOURTH_COLUMN);
		Battlefield.allyGroup.add(hero4.sprite);

		const enemy1 = new Enemy();
		enemy1.render(this, Columns.FIRST_COLUMN);
		Battlefield.enemyGroup.add(enemy1.sprite);

		const enemy2 = new Enemy();
		enemy2.render(this, Columns.SECOND_COLUMN);
		Battlefield.enemyGroup.add(enemy2.sprite);

		const enemy3 = new Enemy();
		enemy3.render(this, Columns.THIRD_COLUMN);
		Battlefield.enemyGroup.add(enemy3.sprite);

		const enemy4 = new Enemy();
		enemy4.render(this, Columns.FOURTH_COLUMN);
		Battlefield.enemyGroup.add(enemy4.sprite);

		this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
			gameObject.x = dragX;
			gameObject.y = dragY;
		});

		this.input.on('dragend', function (pointer, gameObject, dragX, dragY) {
			gameObject.x = gameObject.__initialX;
			gameObject.y = gameObject.__initialY;
		});
	}
}
