import Utilities from "../Utilities";
import MainMenu from "./MainMenu";
import PeerWrapper from "../Plugins/PeerWrapper";
import Lobby from "./Lobby";

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
        const button = element.getChildByName('button');
        button.setAttribute('value', 'Login');

        element.addListener('click');
        const _that = this;
        element.on('click', async function (event) {
            if (event.target.name === 'button') {
                try {
                    const data = {
                        username: this.getChildByName('usernameField').value,
                        password: this.getChildByName('passwordField').value
                    };
                    const response = await fetch("http://localhost:9000/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    });
                    const responseData = await response.json();
                    if (response.status !== 200) {
                        throw new Error(responseData.errorMessage);
                    }
                    const peer = new PeerWrapper(responseData.auth_token);
                    _that.scene.start(Lobby.Name);
                } catch (error) {
                    this.getChildByID('error').innerText = error.message;
                }
            }
        });

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
