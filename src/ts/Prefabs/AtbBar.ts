import Character from "./Character";
import QueueManager from "./QueueManager";

export default class AtbBar {
    character: Character;
    readonly width = 50;
    readonly height = 10;
    currentWidth = 0;

    constructor(character: Character) {
        this.character = character;
    }

    render() {
        const position = this.character.sprite.getBottomCenter();
        const offsetY = 5;

        let progressBar = this.character.sprite.scene.add.graphics();
		let progressBox = this.character.sprite.scene.add.graphics();
		progressBox.fillStyle(0x222222, 0.8);
		progressBox.fillRect(position.x - this.width / 2, position.y + offsetY, this.width, this.height);

        this.currentWidth = Math.floor(Math.random() * (this.width - 0 + 1) + 0);

        progressBar.fillStyle(0xffffff, 1);
        progressBar.fillRect(position.x - this.width / 2, position.y + offsetY, this.currentWidth, this.height);
        progressBar.on('barReady', QueueManager.addTurn, this);

        this.updateProgressBar(this.character.sprite, position, offsetY, progressBar, progressBox);
    }

    updateProgressBar(characterSprite, position, offsetY, progressBar, progressBox) {
        if (this.currentWidth >= this.width) {
            progressBar.emit('barReady', this.character);
            progressBox.destroy();
            return;
        }

        this.currentWidth++;
        progressBar.fillRect(position.x - this.width / 2, position.y + offsetY, this.currentWidth, this.height);

        characterSprite.scene.time.delayedCall(100, this.updateProgressBar, [characterSprite, position, offsetY, progressBar, progressBox], this);
    }
} 
