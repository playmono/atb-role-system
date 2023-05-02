import SplashScreen from "./SplashScreen";
import Utilities from "../Utilities";

export default class Preloader extends Phaser.Scene {
    /**
     * Unique name of the scene.
     */
    public static Name = "Preloader";

    public preload(): void {
        this.addProgressBar();

        this.load.path = "assets/";
        this.load.image("phaser_pixel_medium_flat");
        this.load.image("Phaser-Logo-Small");

        // You should remove this logic; this is only included here to show off the progress bar.
        for (let i = 0; i < 100; i++) {
            this.load.image("Phaser-Logo-Small" + i, "Phaser-Logo-Small.png");
        }

        this.load.spritesheet('tileset', 'tileset.png', { frameWidth: 32, frameHeight: 32});
        this.load.image('levelup', 'level-up.png');

        this.load.image('sword', 'scithersword.png');
        this.load.image('bash', 'bash.png');
        this.load.image('firearrow', 'firearrow.png');
        this.load.image('firebolt', 'firebolt.png');
        this.load.image('heal', 'heal.png');

        this.loadGUI();
        this.loadArcher();
        this.loadBlackMage();
        this.loadNovice();
        this.loadSwordman();
        this.loadWhiteMage();
    }

    public create(): void {
        Utilities.LogSceneMethodEntry("Preloader", "create");

        this.scene.start(SplashScreen.Name);
    }

    public update(): void {
        // preload handles updates to the progress bar, so nothing should be needed here.
    }

    /**
     * Adds a progress bar to the display, showing the percentage of assets loaded and their name.
     */
    private addProgressBar(): void {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        /** Customizable. This text color will be used around the progress bar. */
        const outerTextColor = '#ffffff';

        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 50);

        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: "Loading...",
            style: {
                font: "20px monospace",
                color: outerTextColor
            }
        });
        loadingText.setOrigin(0.5, 0.5);

        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: "0%",
            style: {
                font: "18px monospace",
                color: "#ffffff"
            }
        });
        percentText.setOrigin(0.5, 0.5);

        const assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: "",
            style: {
                font: "18px monospace",
                color: outerTextColor
            }
        });

        assetText.setOrigin(0.5, 0.5);

        this.load.on("progress", (value: number) => {
            percentText.setText(parseInt(value * 100 + "", 10) + "%");
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect((width / 4) + 10, (height / 2) - 30 + 10, (width / 2 - 10 - 10) * value, 30);
        });

        this.load.on("fileprogress", (file: Phaser.Loader.File) => {
            assetText.setText("Loading asset: " + file.key);
        });

        this.load.on("complete", () => {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }

    private loadGUI(): void {
        this.load.image('text_background', 'bt.png');
    }

    private loadNovice(): void {
        this.load.image('novice_icon', 'gray_11.png');

        this.load.atlas('novice_boy_idle', 'roles/Novice/Boy/Idle/spritesheet.png', 'roles/Novice/Boy/Idle/spritesheet.json');
        this.load.atlas('novice_boy_hurt', 'roles/Novice/Boy/Hurt/spritesheet.png', 'roles/Novice/Boy/Hurt/spritesheet.json');

        this.load.atlas('novice_girl_idle', 'roles/Novice/Girl/Idle/spritesheet.png', 'roles/Novice/Girl/Idle/spritesheet.json');
        this.load.atlas('novice_girl_hurt', 'roles/Novice/Girl/Hurt/spritesheet.png', 'roles/Novice/Girl/Hurt/spritesheet.json');
    }

    private loadArcher(): void {
        this.load.image('archer_icon', 'blue_16.png');

        this.load.atlas('archer_idle', 'roles/Archer/Idle/spritesheet.png', 'roles/Archer/Idle/spritesheet.json');
    }

    private loadBlackMage(): void {
        this.load.image('blackmage_icon', 'violet_08.PNG');

        this.load.atlas('blackmage_idle', 'roles/BlackMage/Idle/spritesheet.png', 'roles/BlackMage/Idle/spritesheet.json');
    }

    private loadSwordman(): void {
        this.load.image('swordman_icon', 'yellow_18.PNG');
        this.load.atlas('swordman_idle', 'roles/Swordman/Idle/spritesheet.png', 'roles/Swordman/Idle/spritesheet.json');
    }

    private loadWhiteMage(): void {
        this.load.image('whitemage_icon', 'green_20.PNG');

        this.load.atlas('whitemage_idle', 'roles/WhiteMage/Idle/spritesheet.png', 'roles/WhiteMage/Idle/spritesheet.json');
    }
}
