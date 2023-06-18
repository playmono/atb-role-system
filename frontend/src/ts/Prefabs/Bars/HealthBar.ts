import CharacterBar from "../CharacterBar";
import { Rows } from "../Enums";

export default class HealthBar extends CharacterBar {
    render(): void {
        const oneThirdY = this.character.sprite.scene.cameras.main.width / 3;
        const offsetY = this.character.row === Rows.BELOW_ROW ? 15 : 60;

        this.x = this.character.sprite.getBottomCenter().x - CharacterBar.width / 2;
        this.y = oneThirdY * (this.character.row * 3 + 1) + offsetY;

        this.bar = this.character.sprite.scene.add.graphics();
        this.update();
    }

    update(): void {
        let width = CharacterBar.width * this.character.healthCurrent / this.character.healthMax;

        if (width < 0) {
            width = 0;
        }

        if (width > 100) {
            width = 100;
        }

        this.bar.clear();
        this.bar.fillStyle(this.getColor(width), 1);
        this.bar.fillRect(this.x, this.y, width, CharacterBar.height);
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
