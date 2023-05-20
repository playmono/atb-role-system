import Utilities from "../Utilities";
import Battlefield from "./Battlefied";
import MainMenu from "./MainMenu";
import MainSettings from "./MainSettings";

export default class Login extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
    public static Name = "Login";

    public preload(): void {
        this.load.html('login', 'assets/html/login.html');
    }

    public create(): void {
        Utilities.LogSceneMethodEntry("Login", "create");
		const startYPosition = this.cameras.main.height / 4;
		const fontSize = 25;

        const element = this.add.dom(this.cameras.main.centerX, startYPosition).createFromCache('login');
        const button = element.getChildByName('playButton');
        button.setAttribute('value', 'Login');

		// Add a button to return to the main menu.
		const backText = this.add.text(this.cameras.main.centerX, startYPosition * 2, "Go Back");
		backText
			.setOrigin(0.5)
			.setFontFamily("monospace").setFontSize(fontSize).setFill("#fff")
			.setInteractive();
		backText.on("pointerdown", () => { this.scene.start(MainMenu.Name); }, this);
    }

    public update(): void {
        // Update logic, as needed.
    }
}
