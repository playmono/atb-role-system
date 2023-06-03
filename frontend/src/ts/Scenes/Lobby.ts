import Utilities from "../Utilities";
import MainMenu from "./MainMenu";
import GameServer from "../Prefabs/GameServer";
import Battlefield from "./Battlefied";

export default class Lobby extends Phaser.Scene {
	/**
	 * Unique name of the scene.
	 */
    public static Name = "Lobby";
    static playerNamesList: Phaser.GameObjects.Group;

    public preload(): void {
        this.load.html('login', 'assets/html/login.html');
    }

    public async create(): Promise<void> {
        Lobby.playerNamesList = this.physics.add.group();

        this.renderPlayerList();

        const gameServer = new GameServer();

        gameServer.peer.socket.on('message', (message) => {
            if (message.type === 'connect') {
                this.renderPlayerList();
            }
            if (message.type === 'disconnect') {
                this.renderPlayerList();
            }
            if (message.type === 'challenge') {
                this.renderChallengeReceived(message.data.player);
            }
            if (message.type === 'startGame') {
                this.startGame(message.data.challengeId);
            }
        });

        const startYPosition = this.cameras.main.height / 4;
		const fontSize = 25;

        // Add a button to return to the main menu.
		const backText = this.add.text(this.cameras.main.centerX, startYPosition * 2 + 100, "Go Back");
		backText
			.setOrigin(0.5)
			.setFontFamily("monospace").setFontSize(fontSize).setFill("#fff")
			.setInteractive();
		backText.on("pointerdown", () => { this.scene.start(MainMenu.Name); }, this);
    }

    private renderPlayerList() {
        Lobby.playerNamesList.clear(true, true);

        // User
        const gameServer = new GameServer();
        const text = this.add.text(20, 50, gameServer.player.username + ' ' + gameServer.player.rating, { color: '#00a6ed' });
        Lobby.playerNamesList.add(text);

        // Rest of users
        const startYPosition = this.cameras.main.height / 4;
        let positionY = startYPosition;
        const offsetY = 50;

        gameServer.playerList.forEach((player) => {
            const challengeIcon = this.add.sprite(25, positionY + 7, 'challenge_icon');
            challengeIcon.scale = 0.025;
            challengeIcon.on("pointerdown", () => { this.challengePlayer(player); }, this);
            challengeIcon.setInteractive();
            const text = this.add.text(50, positionY, player.username + ' ' + player.rating);
            text.setInteractive();
            text.on("pointerdown", () => { this.challengePlayer(player); }, this);
            Lobby.playerNamesList.addMultiple([text, challengeIcon]);
            positionY += offsetY;
        })
    }

    private challengePlayer(player): void {
        const gameServer = new GameServer();
        gameServer.challengePlayer(player);
        this.add.text(20, 280, [`Waiting for ${player.username} ${player.rating} to accept your challenge`]);
    }

    private renderChallengeReceived(player: any): void {
        const gameServer = new GameServer();
        const text = this.add.text(20, 280, ['You have challenge from', `${player.username} ${player.rating}`]);
        const acceptButton = this.add.image(this.cameras.main.centerX - 50, 350, 'accept_button');
        acceptButton.setInteractive();
        acceptButton.scale = 0.25;
        acceptButton.on("pointerdown", () => { gameServer.acceptChallenge(); }, this);

        const declineButton = this.add.image(this.cameras.main.centerX + 50, 350, 'decline_button');
        declineButton.setInteractive();
        declineButton.scale = 0.25;
    }

    private startGame(challengeId: string): void {
        const gameServer = new GameServer();
        if (gameServer.challengeId !== challengeId) {
            console.error('error. challenge id different');
            return;
        }

        this.scene.start(Battlefield.Name);
    }
}
