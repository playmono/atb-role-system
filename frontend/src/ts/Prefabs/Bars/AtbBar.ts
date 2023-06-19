import CharacterBar from "../CharacterBar";
import { Rows } from "../Enums";

export default class AtbBar extends CharacterBar {
    progressBox;
    currentWidth = 0;
    offsetY = 10;
    atbStop: boolean = false;

    render() {
        this.currentWidth = 0;

        this.bar = this.character.sprite.scene.add.graphics();
        this.progressBox = this.character.sprite.scene.add.graphics();

        const oneThirdY = this.character.sprite.scene.cameras.main.width / 3;
        const offsetY = this.character.row === Rows.BELOW_ROW ? 15 : 60;

        this.x = this.character.sprite.getBottomCenter().x - CharacterBar.width / 2;
        this.y = oneThirdY * (this.character.row * 3 + 1) + offsetY;

        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(this.x, this.y + this.offsetY, CharacterBar.width, CharacterBar.height);

        this.bar.fillStyle(0xffffff, 1);
        this.bar.on('barReady', this.character.barReady, this.character);

        this.updateProgressBar();
    }

    updateProgressBar() {
        if (this.atbStop) {
            return;
        }

        if (this.currentWidth >= CharacterBar.width) {
            this.bar.emit('barReady');
            this.progressBox.destroy();
            return;
        }

        this.bar.fillRect(this.x, this.y + this.offsetY, this.currentWidth, CharacterBar.height);
        this.currentWidth++;

        this.character.sprite.scene.time.delayedCall(200, this.updateProgressBar, [], this);
    }

    stop() {
        this.atbStop = true;
    }
} 
