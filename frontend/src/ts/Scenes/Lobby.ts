import Utilities from "../Utilities";
import MainMenu from "./MainMenu";
import PeerWrapper from "../Plugins/PeerWrapper";

export default class Lobby extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
    public static Name = "Lobby";

    public preload(): void {
        this.load.html('login', 'assets/html/login.html');
    }

    public async create(): Promise<void> {
        const startYPosition = this.cameras.main.height / 4;
		const fontSize = 25;

        const peer = new PeerWrapper();

        const response = await fetch("http://localhost:9000/active-players", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });
        const responseData = await response.json();

        const offsetY = 50;
        let positionY = startYPosition;
        responseData.forEach((item) => {
            this.add.text(50, positionY, item[1].username);
            positionY += offsetY;
        })

		// Add a button to return to the main menu.
		const backText = this.add.text(this.cameras.main.centerX, startYPosition * 2 + 100, "Go Back");
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
