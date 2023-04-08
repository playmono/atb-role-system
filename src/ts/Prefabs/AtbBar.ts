import Character from "./Character";

export default class AtbBar {
    progressBar;
    progressBox;
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

        this.progressBar = this.character.sprite.scene.add.graphics();
		this.progressBox = this.character.sprite.scene.add.graphics();
		this.progressBox.fillStyle(0x222222, 0.8);
		this.progressBox.fillRect(position.x - this.width / 2, position.y + offsetY, this.width, this.height);

        this.currentWidth = Math.floor(Math.random() * (this.width / 2 + 1) + 0);

        this.progressBar.fillStyle(0xffffff, 1);
        this.progressBar.fillRect(position.x - this.width / 2, position.y + offsetY, this.currentWidth, this.height);
        this.progressBar.on('barReady', this.character.barReady, this.character);

        this.updateProgressBar(this.character.sprite, position, offsetY, this.progressBar, this.progressBox);
    }

    updateProgressBar(characterSprite, position, offsetY, progressBar, progressBox) {
        if (this.currentWidth >= this.width) {
            progressBar.emit('barReady');
            progressBox.destroy();
            return;
        }

        this.currentWidth++;
        progressBar.fillRect(position.x - this.width / 2, position.y + offsetY, this.currentWidth, this.height);

        characterSprite.scene.time.delayedCall(200, this.updateProgressBar, [characterSprite, position, offsetY, progressBar, progressBox], this);
    }
} 
