import Utilities from "../Utilities";
import Battlefield from "./Battlefied";
import Login from "./Login";
import MainSettings from "./MainSettings";
import SignUp from "./SignUp";

export default class MainMenu extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
    public static Name = "MainMenu";
    private music = null;

    public preload(): void {
        // Preload as needed.
    }

    public create(): void {
        Utilities.LogSceneMethodEntry("MainMenu", "create");

        this.sound.stopByKey('lobby');

        if (!this.music || !this.music.isPlaying) {
            this.music = this.sound.add('music_intro', {loop: true, volume: 0.8});
            this.music.play();
        }

        const logo = this.add.image(this.cameras.main.centerX, 150, 'logo');
        logo.scale = 0.25;

        const loginText = this.add.text(this.cameras.main.centerX, logo.y + 180, "Login");
        loginText
            .setFontFamily("monospace")
            .setFontSize(40)
            .setFill("#fff")
            .setAlign("center")
            .setOrigin(0.5);
            loginText.setInteractive();
            loginText.on("pointerdown", () => {
                this.sound.play('select');
                this.scene.start(Login.Name);
            }, this);

        const signUpText = this.add.text(this.cameras.main.centerX, loginText.y + 100, "Sign up");
        signUpText
            .setFontFamily("monospace")
            .setFontSize(40)
            .setFill("#fff")
            .setAlign("center")
            .setOrigin(0.5);
        signUpText.setInteractive();
        signUpText.on("pointerdown", () => {
            this.sound.play('select');
            this.scene.start(SignUp.Name);
        }, this);

        const settingsText = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 50, "Settings");
        settingsText.setOrigin(0.5);
        settingsText.setFontSize(30).setFill("#fff");
        settingsText.setInteractive();
        settingsText.on("pointerdown", () => {
            this.sound.play('select');
            this.scene.start(MainSettings.Name);
        }, this);
    }

    public update(): void {
        // Update logic, as needed.
    }
}
