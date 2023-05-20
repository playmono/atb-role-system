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

    public preload(): void {
        // Preload as needed.
    }

    public create(): void {
        Utilities.LogSceneMethodEntry("MainMenu", "create");
        const textYPosition = this.cameras.main.height / 3;

        const loginText = this.add.text(this.cameras.main.centerX, textYPosition, "Login");
        loginText
            .setFontFamily("monospace")
            .setFontSize(40)
            .setFill("#fff")
            .setAlign("center")
            .setOrigin(0.5);
            loginText.setInteractive();
            loginText.on("pointerdown", () => { this.scene.start(Login.Name); }, this);

        const signUpText = this.add.text(this.cameras.main.centerX, textYPosition + 100, "Sign up");
        signUpText
            .setFontFamily("monospace")
            .setFontSize(40)
            .setFill("#fff")
            .setAlign("center")
            .setOrigin(0.5);
        signUpText.setInteractive();
        signUpText.on("pointerdown", () => { this.scene.start(SignUp.Name); }, this);

        const settingsText = this.add.text(this.cameras.main.centerX, textYPosition * 2 + 100, "Settings");
        settingsText.setOrigin(0.5);
        settingsText.setFontFamily("monospace").setFontSize(30).setFill("#fff");
        settingsText.setInteractive();
        settingsText.on("pointerdown", () => { this.scene.start(MainSettings.Name); }, this);
    }

    public update(): void {
        // Update logic, as needed.
    }
}
