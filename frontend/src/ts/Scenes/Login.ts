import Utilities from "../Utilities";
import MainMenu from "./MainMenu";
import GameServer from "../Prefabs/GameServer";
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

        const logo = this.add.image(this.cameras.main.centerX, 150, 'logo');
        logo.scale = 0.25;
        /*
        this.tweens.add({
            targets: logo,
            duration: 500,
            scaleX: 3,
            scaleY: 3,
        });
        */

        const loginText = this.add.text(this.cameras.main.centerX, logo.y + 180, "Login");
        loginText
            .setFontFamily("monospace")
            .setFontSize(40)
            .setFill("#fff")
            .setAlign("center")
            .setOrigin(0.5);

        const element = this.add.dom(this.cameras.main.centerX, loginText.y + 100).createFromCache('login');
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
                    const url = process.env.APP_PROTOCOL + '://' + process.env.APP_URL + ':' + process.env.APP_PORT;
                    const response = await fetch(`${url}/login`, {
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
                    const gameServer = new GameServer(responseData.auth_token);
                    gameServer.peer.on('open', async (id) => {
                        await gameServer.setPlayer();
                        await gameServer.setPlayerList();
                        element.destroy();
                        backText.destroy();
                        loginText.destroy();
                        _that.sound.play('teleport');
                        _that.tweens.add({
                            targets: logo,
                            duration: 500,
                            scaleX: 15,
                            scaleY: 15,
                            onComplete: () => {
                                _that.scene.start(Lobby.Name);
                            }
                        });
                    });
                } catch (error) {
                    _that.sound.play('error');
                    console.log(error.message);
                    this.getChildByID('error').innerText = error.message;
                }
            }
        });

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

    public update(): void {
        // Update logic, as needed.
    }
}
