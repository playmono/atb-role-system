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
    static challengeGameObjects: Phaser.GameObjects.Group;

    public preload(): void {
        this.load.html('login', 'assets/html/login.html');
    }

    public async create(): Promise<void> {
        Lobby.playerNamesList = this.physics.add.group();
        Lobby.challengeGameObjects = this.physics.add.group();

        this.renderPlayerList();

        const gameServer = new GameServer();

        gameServer.peer.socket.on('message', (message) => {
            if (message.type === 'connect') {
                this.renderPlayerList();
            }
            if (message.type === 'disconnect') {
                this.renderPlayerList();
            }
            if (message.type === 'challengeOffer') {
                this.renderChallengeReceived(message.data.from);
            }
            if (message.type === 'challengeResponse') {
                this.challengeResponse(message.data);
            }
            if (message.type === 'playerUpdate') {
                this.renderPlayerList();
            }
        });

        const startYPosition = this.cameras.main.height / 4;
		const fontSize = 25;

        // Add a button to return to the main menu.
		const backText = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 50, "Go Back");
		backText
			.setOrigin(0.5)
			.setFontFamily("monospace").setFontSize(fontSize).setFill("#fff")
			.setInteractive();
		backText.on("pointerdown", () => {
            gameServer.closeConnection();
            this.scene.start(MainMenu.Name);
        }, this);
    }

    private renderPlayerList() {
        Lobby.playerNamesList.clear(true, true);

        // User
        const gameServer = new GameServer();
        const text = this.add.text(
            this.cameras.main.width - 10,
            10,
            gameServer.player.username + ' ' + gameServer.player.rating,
            { color: '#00a6ed', align: 'right' }
        )
        .setOrigin(1, 0);
        Lobby.playerNamesList.add(text);

        // Rest of users

        const startYPosition = this.cameras.main.height / 4;
        let positionY = startYPosition;
        const offsetY = 50;

        gameServer.playerList.forEach((player) => {
            const challengeIconName = player.status === 'pending' ? 'challenge_icon' : 'waiting_icon';
            const challengeIcon = this.add.sprite(25, positionY + 7, challengeIconName);
            challengeIcon.scale = player.status === 'pending' ? 0.025 : 0.15;
            const text = this.add.text(50, positionY, player.username + ' ' + player.rating);

            if (player.status === 'pending') {
                challengeIcon.on("pointerdown", () => { this.challengePlayer(player); }, this);
                challengeIcon.setInteractive();
                text.setInteractive();
                text.on("pointerdown", () => { this.challengePlayer(player); }, this);
            }

            if (player.status === 'challenged') {
                text.setColor('#4a4949');
            }

            Lobby.playerNamesList.addMultiple([text, challengeIcon]);
            positionY += offsetY;
        });
    }

    private challengePlayer(player): void {
        const gameServer = new GameServer();
        Lobby.challengeGameObjects.clear(true, true);
        gameServer.challengePlayer(player)
        .then((message) => {
            message = `Waiting for ${player.username} ${player.rating} to accept your challenge`;
            const text = this.add.text(20, 280, [message]);
            Lobby.challengeGameObjects.add(text);

            const declineButton = this.add.image(this.cameras.main.centerX, 330, 'decline_button');
            declineButton.setInteractive();
            declineButton.scale = 0.25;
            declineButton.on("pointerdown", () => { gameServer.respondChallenge('decline'); }, this);
            Lobby.challengeGameObjects.add(declineButton);

        })
        .catch((message) => {
            const text = this.add.text(20, 280, [message]);
            Lobby.challengeGameObjects.add(text);
        })
    }

    private renderChallengeReceived(player: any): void {
        const gameServer = new GameServer();

        Lobby.challengeGameObjects.clear(true, true);
        const text = this.add.text(20, 280, ['You have challenge from', `${player.username} ${player.rating}`]);

        const acceptButton = this.add.image(this.cameras.main.centerX - 50, 350, 'accept_button');
        acceptButton.setInteractive();
        acceptButton.scale = 0.25;
        acceptButton.on("pointerdown", () => { gameServer.respondChallenge('accept'); }, this);

        const declineButton = this.add.image(this.cameras.main.centerX + 50, 350, 'decline_button');
        declineButton.setInteractive();
        declineButton.scale = 0.25;
        declineButton.on("pointerdown", () => { gameServer.respondChallenge('decline'); }, this);

        Lobby.challengeGameObjects.addMultiple([text, acceptButton, declineButton]);
    }

    private challengeResponse(data: any): void {
        const gameServer = new GameServer();
        if (gameServer.challengeId !== data.challengeId) {
            console.error('error. challenge id different');
            return;
        }

        switch (data.status) {
            case 'accept':
                this.scene.start(Battlefield.Name);
            break;
            case 'decline':
                gameServer.declineChallenge();
                Lobby.challengeGameObjects.clear(true, true);
            break;
            default:
                throw Error(`Status of challenge invalid: ${data.status}`);
        }
    }
    /*
    private playerUpdate(data: any): void {
        const gameServer = new GameServer();
        switch (data.status) {
            case 'pending':
                gameServer.playerList.forEach((player) => {
                    if (data.players.includes(player.id)) {
                        
                    }
                })
        }
    }
    */
}
