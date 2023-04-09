import Character from "../Character";
import CharacterBar from "../CharacterBar";

export default class HealthBar extends CharacterBar {
    render(): void {
        const position = this.character.sprite.getBottomCenter();
        const offsetY = 5;

		let healthBox = this.character.sprite.scene.add.graphics();
		healthBox.fillStyle(0x0fff57, 0.8);
		//healthBox.fillRect(position.x - CharacterBar.width / 2, position.y + offsetY, CharacterBar.width, CharacterBar.height);

        this.bar = this.character.sprite.scene.add.graphics();
        this.update();
    }

    update(): void {
        const position = this.character.sprite.getBottomCenter();
        const offsetY = 5;
        let width = CharacterBar.width * this.character.healthCurrent / this.character.healthMax;

        if (width < 0) {
            width = 0;
        }

        if (width > 100) {
            width = 100;
        }

        this.bar.clear();
        this.bar.fillStyle(this.getColor(width), 1);
        this.bar.fillRect(position.x - CharacterBar.width / 2, position.y + offsetY, width, CharacterBar.height);
    }

    private getColor(width: number): number {
        const quarter = CharacterBar.width / 4;
        if (width > quarter * 3) {
            return 0x69ff96;
        }

        if (width > quarter) {
            return 0xf5f765;
        }

        return 0xf5413b;
    }

}
