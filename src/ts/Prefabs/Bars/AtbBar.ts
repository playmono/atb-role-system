import CharacterBar from "../CharacterBar";

export default class AtbBar extends CharacterBar {
    progressBox;
    currentWidth = 0;

    render() {
        const position = this.character.sprite.getBottomCenter();
        const offsetY = 10;

        this.bar = this.character.sprite.scene.add.graphics();
        this.progressBox = this.character.sprite.scene.add.graphics();
        this.progressBox.fillStyle(0x222222, 0.8);
        this.progressBox.fillRect(position.x - CharacterBar.width / 2, position.y + offsetY, CharacterBar.width, CharacterBar.height);

        this.currentWidth = Math.floor(Math.random() * (CharacterBar.width / 2 + 1) + 0);

        this.bar.fillStyle(0xffffff, 1);
        this.bar.fillRect(position.x - CharacterBar.width / 2, position.y + offsetY, this.currentWidth, CharacterBar.height);
        this.bar.on('barReady', this.character.barReady, this.character);

        this.updateProgressBar(this.character.sprite, position, offsetY, this.bar, this.progressBox);
    }

    updateProgressBar(characterSprite, position, offsetY, progressBar, progressBox) {
        if (this.currentWidth >= CharacterBar.width) {
            progressBar.emit('barReady');
            progressBox.destroy();
            return;
        }

        this.currentWidth++;
        progressBar.fillRect(position.x - CharacterBar.width / 2, position.y + offsetY, this.currentWidth, CharacterBar.height);

        characterSprite.scene.time.delayedCall(1, this.updateProgressBar, [characterSprite, position, offsetY, progressBar, progressBox], this);
    }
} 
