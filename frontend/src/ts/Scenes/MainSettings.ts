import Utilities from "../Utilities";
import MainMenu from "./MainMenu";

export default class MainSettings extends Phaser.Scene {
    public static Name = "MainSettings";
    public static Background = null;
    private buttonsGroup = null;
    private rectangle = null;

    public create(): void {
        Utilities.LogSceneMethodEntry("MainSettings", "create");

        this.buttonsGroup = this.physics.add.group();

        const settingsText = this.add.text(this.cameras.main.centerX, 50, "Settings");
        settingsText
            .setFontSize(40)
            .setFill("#fff")
            .setAlign("center")
            .setOrigin(0.5);

        const musicText = this.add.text(20, settingsText.y + 100, "Music:");
        //const soundsEffectText = this.add.text(20, musicText.y + 30, "Sounds effects:");
        const backgroundText = this.add.text(20, musicText.y + 30, "Background:");

        const musicPlayButton = this.add.image(musicText.width + 40, musicText.y + 5, !this.sound.mute ? 'play_button_enabled' : 'play_button_disabled');
        musicPlayButton.scale = 0.15;
        musicPlayButton.setInteractive();

        const switchButton = this.add.image(backgroundText.width + 60, backgroundText.y + 5, !MainSettings.Background ? 'switch_off' : 'switch_on');
        switchButton.scale = 0.20;
        switchButton.setInteractive();

        /*
        const sfxPlayButton = this.add.image(soundsEffectText.width + 40, soundsEffectText.y, !this.sound.mute ? 'play_button_enabled' : 'play_button_disabled');
        sfxPlayButton.scale = 0.20;
        sfxPlayButton.setInteractive();
        */

        musicPlayButton.on("pointerdown", () => {
            this.sound.mute = !this.sound.mute;
            musicPlayButton.setTexture(this.sound.mute ? 'play_button_disabled' : 'play_button_enabled');
        }, this);

        /*
        sfxPlayButton.on("pointerdown", async() => {
            this.sound.mute = !this.sound.mute;
            this.sound.add()
            sfxPlayButton.setTexture(this.sound.mute ? 'play_button_enabled' : 'play_button_disabled');
        }, this);
        */

        let open = MainSettings.Background !== null;

        if (open) {
            this.renderBackgrounds(backgroundText.y);
        }

        switchButton.on("pointerdown", () => {
            this.sound.play('select');
            open = !open;
            if (!open) {
                switchButton.setTexture('switch_off');
                this.buttonsGroup.clear(true, true);
                MainSettings.Background = null;
            } else {
                switchButton.setTexture('switch_on');
                this.renderBackgrounds(backgroundText.y);
            }
        }, this);

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

    renderBackgrounds(y: number): void {
        const oneThirdX = this.cameras.main.width / 3;

        const bg1 = this.add.image(oneThirdX, y + 100, 'background1-mini');
        bg1.setOrigin(0.5);
        bg1.scale = 0.25;
        bg1.setInteractive();
        const bg2 = this.add.image(oneThirdX * 2, y + 100, 'background2-mini');
        bg2.setOrigin(0.5);
        bg2.scale = 0.25;
        bg2.setInteractive();
        const bg3 = this.add.image(oneThirdX, y + 200, 'background3-mini');
        bg3.setOrigin(0.5);
        bg3.scale = 0.25;
        bg3.setInteractive();
        const bg4 = this.add.image(oneThirdX * 2, y + 200, 'background4-mini');
        bg4.setOrigin(0.5);
        bg4.scale = 0.25;
        bg4.setInteractive();

        this.buttonsGroup.addMultiple([bg1, bg2, bg3, bg4]);

        bg1.on("pointerdown", () => {
            this.sound.play('select');
            this.selectBackground(bg1);
        });
        bg2.on("pointerdown", () => {
            this.sound.play('select');
            this.selectBackground(bg2);
        });
        bg3.on("pointerdown", () => {
            this.sound.play('select');
            this.selectBackground(bg3);
        });
        bg4.on("pointerdown", () => {
            this.sound.play('select');
            this.selectBackground(bg4);
        });

        if (MainSettings.Background !== null) {
            this.selectBackground(MainSettings.Background);
        }
    }

    selectBackground(background: Phaser.GameObjects.Image): void  {
        if (this.rectangle) {
            this.rectangle.destroy();
        }

        this.rectangle = this.add.rectangle(background.x, background.y, background.width, background.height);
        this.rectangle.scale = 0.30;
        this.rectangle.setStrokeStyle(5, 0x00ff00);
        this.rectangle.setOrigin(0.5);
        this.buttonsGroup.add(this.rectangle);

        MainSettings.Background = background;
    }
}
