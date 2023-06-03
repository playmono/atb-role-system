import Utilities from "../Utilities";
import Battlefield from "./Battlefied";
import MainMenu from "./MainMenu";
import MainSettings from "./MainSettings";

export default class SignUp extends Phaser.Scene {
    public static Name = "SignUp";

    public preload(): void {
        this.load.html('login', 'assets/html/login.html');
    }

    public create(): void {
        Utilities.LogSceneMethodEntry("SignUp", "create");
        const startYPosition = this.cameras.main.height / 4;
        const fontSize = 25;

        const element = this.add.dom(this.cameras.main.centerX, startYPosition).createFromCache('login');
        element.addListener('click');
        element.on('click', async function (event) {
            if (event.target.name === 'button') {
                try {
                    const data = {
                        username: this.getChildByName('usernameField').value,
                        password: this.getChildByName('passwordField').value
                    };
                    const url = process.env.APP_PROTOCOL + '://' + process.env.APP_URL + ':' + process.env.APP_PORT;
                    const response = await fetch(`${url}/sign-up`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data)
                    });
                    if (response.status !== 201) {
                        const responseData = await response.json();
                        throw new Error(responseData.errorMessage);
                    }
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
