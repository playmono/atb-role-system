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
    listenersSetup: boolean = false;

    public preload(): void {
        this.load.html('login', 'assets/html/login.html');
    }

    public async create(): Promise<void> {
        Lobby.playerNamesList = this.physics.add.group();
        Lobby.challengeGameObjects = this.physics.add.group();

        this.sound.stopByKey('music_intro');
        this.sound.stopByKey('battle');

        if (!this.sound.get('lobby') || !this.sound.get('lobby').isPlaying) {
            this.sound.play('lobby', {loop: true, volume: 0.8});
        }

        this.renderPlayerList();

        if (!this.listenersSetup) {
            this.setupListeners();
        }

        const startYPosition = this.cameras.main.height / 4;
		const fontSize = 25;

        // Add a button to return to the main menu.
        const backText = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 50, "Go Back");
        backText
            .setOrigin(0.5)
            .setFontFamily("monospace").setFontSize(fontSize).setFill("#fff")
            .setInteractive();
        backText.on("pointerdown", () => {
            const gameServer = new GameServer();
            gameServer.closeConnection();
            this.listenersSetup = false;
            this.sound.play('back');
            this.scene.start(MainMenu.Name);
        }, this);
    }

    private setupListeners(): void {
        this.listenersSetup = true;
        const gameServer = new GameServer();

        gameServer.peer.socket.on('message', (message) => {
            console.log('Received message from server', message);
            if (!this.scene.isActive(this)) {
                return;
            }
            if (message.type === 'gameConnect') {
                this.renderPlayerList();
            }
            if (message.type === 'gameDisconnect') {
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

        gameServer.peer.on('connection', (conn) => {
            conn.on('data', (data: any) => {
                console.log("Received on lobby", data);
                if (data.type === 'startGame') {
                    this.scene.start(Battlefield.Name);
                }
                if (data.type === "battlefieldLoaded") {
                    const battleFieldScene = this.scene.get(Battlefield.Name) as any;
                    battleFieldScene.battlefieldIsReady = true;
                }
            });
        });
    }

    private renderPlayerList() {
        Lobby.playerNamesList.clear(true, true);

        // User
        const gameServer = new GameServer();
        const text = this.add.text(
            this.cameras.main.width - 10,
            10,
            `${gameServer.player.username} (${gameServer.player.rating})`,
            { color: '#00a6ed', align: 'right' }
        )
        .setOrigin(1, 0);
        Lobby.playerNamesList.add(text);

        // Rest of users

        const startYPosition = 70;
        let positionY = startYPosition;
        const offsetY = 50;

        if (gameServer.playerList.length === 0) {
            const text = this.add.text(
                this.cameras.main.centerX,
                this.cameras.main.centerY - 100,
                'Waiting for other players \nto connect...'
            );
            text.setOrigin(0.5);
            Lobby.playerNamesList.add(text);
        } else {
            const text = this.add.text(this.cameras.main.centerX, positionY, 'Player list');
            text.setOrigin(0.5);
            Lobby.playerNamesList.add(text);
        }

        positionY += 40;

        gameServer.playerList.forEach((player) => {
            let challengeIconName = '';
            switch (player.status) {
                case 'pending': challengeIconName = 'pending_icon'; break;
                case 'challenged': challengeIconName = 'challenged_icon'; break;
                case 'ingame': challengeIconName = 'ingame_icon'; break;
            }
            const challengeIcon = this.add.sprite(25, positionY + 7, challengeIconName);
            challengeIcon.scale = 0.050;
            const text = this.add.text(60, positionY, `${player.username} (${player.rating})`);

            if (player.status === 'pending' && !gameServer.challengeId) {
                challengeIcon.on("pointerdown", () => { this.challengePlayer(player); }, this);
                text.on("pointerdown", () => { this.challengePlayer(player); }, this);
                challengeIcon.setInteractive();
                text.setInteractive();
            }

            if (player.status === 'challenged' || gameServer.challengeId) {
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
            this.sound.play('select');
            message = `Waiting for ${player.username} (${player.rating})\nto accept your challenge`;
            const text = this.add.text(this.cameras.main.centerX, 450, [message]);
            text.setOrigin(0.5);
            Lobby.challengeGameObjects.add(text);
            const declineButton = this.add.image(this.cameras.main.centerX, 520, 'decline_button');
            declineButton.setInteractive();
            declineButton.scale = 0.25;
            declineButton.on("pointerdown", () => {
                gameServer.respondChallenge('decline', () => {
                    this.sound.play('back');
                    Lobby.challengeGameObjects.clear(true, true);
                });
            }, this);
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
        const text = this.add.text(this.cameras.main.centerX, 450, `You have a new challenge from\n${player.username} (${player.rating})`);
        text.setOrigin(0.5);

        this.sound.play('select');

        const acceptButton = this.add.image(this.cameras.main.centerX - 50, 520, 'accept_button');
        acceptButton.setInteractive();
        acceptButton.scale = 0.25;

        acceptButton.on("pointerdown", () => {
            gameServer.respondChallenge('accept',
            () => {
                this.sound.play('confirm');
                this.scene.start(Battlefield.Name);
            },
            () => {
                this.sound.play('error');
                Lobby.challengeGameObjects.clear(true, true);
            }
            );
        }, this);

        const declineButton = this.add.image(this.cameras.main.centerX + 50, 520, 'decline_button');
        declineButton.setInteractive();
        declineButton.scale = 0.25;
        declineButton.on("pointerdown", () => {
            gameServer.respondChallenge('decline', () => {
                this.sound.play('back');
                Lobby.challengeGameObjects.clear(true, true);
            });
        }, this);

        Lobby.challengeGameObjects.addMultiple([text, acceptButton, declineButton]);
    }

    private challengeResponse(data: any): void {
        if (data.status === 'decline') {
            this.sound.play('back');
        } else {
            this.sound.play('confirm');
        }
        Lobby.challengeGameObjects.clear(true, true);
    }
}
