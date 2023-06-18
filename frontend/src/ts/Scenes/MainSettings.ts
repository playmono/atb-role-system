import Utilities from "../Utilities";
import MainMenu from "./MainMenu";

export default class MainSettings extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
	public static Name = "MainSettings";

	public create(): void {
		Utilities.LogSceneMethodEntry("MainSettings", "create");

		const settingsText = this.add.text(this.cameras.main.centerX, 50, "Settings");
        settingsText
            .setFontSize(40)
            .setFill("#fff")
            .setAlign("center")
            .setOrigin(0.5);

		const musicText = this.add.text(20, settingsText.y + 100, "Music:");
		//const soundsEffectText = this.add.text(20, musicText.y + 30, "Sounds effects:");
		const backgroundText = this.add.text(20, musicText.y + 30, "Background:");

		const musicPlayButton = this.add.image(musicText.width + 40, musicText.y, !this.sound.mute ? 'play_button_enabled' : 'play_button_disabled');
		musicPlayButton.scale = 0.20;
		musicPlayButton.setInteractive();
		/*
		const sfxPlayButton = this.add.image(soundsEffectText.width + 40, soundsEffectText.y, !this.sound.mute ? 'play_button_enabled' : 'play_button_disabled');
		sfxPlayButton.scale = 0.20;
		sfxPlayButton.setInteractive();
		*/

		musicPlayButton.on("pointerdown", async() => {
			this.sound.mute = !this.sound.mute;
			musicPlayButton.setTexture(this.sound.mute ? 'play_button_enabled' : 'play_button_disabled');
        }, this);

		/*
		sfxPlayButton.on("pointerdown", async() => {
			this.sound.mute = !this.sound.mute;
			this.sound.add()
			sfxPlayButton.setTexture(this.sound.mute ? 'play_button_enabled' : 'play_button_disabled');
        }, this);
		*/

		// Add a button to return to the main menu.
		const backText = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 50, "Go Back");
		backText
			.setOrigin(0.5)
			.setFontFamily("monospace").setFontSize(25).setFill("#fff")
			.setInteractive();
		backText.on("pointerdown", () => {
			this.sound.play('back');
			this.scene.start(MainMenu.Name);
		}, this);
	}
}
