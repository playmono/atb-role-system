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

        this.loadSfx();
        this.loadVfx();
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

    private loadSfx(): void {
        this.load.audio('changerole', 'sfx/changejob.mp3');
        this.load.audio('music_intro', 'sfx/music-intro.mp3');
        this.load.audio('teleport', 'sfx/teleport.mp3');
        this.load.audio('lobby', 'sfx/lobby.mp3');
        this.load.audio('back', 'sfx/back.mp3');
        this.load.audio('select', 'sfx/select.mp3');
        this.load.audio('confirm', 'sfx/confirm.mp3');
        this.load.audio('error', 'sfx/error.mp3');
        this.load.audio('battle', 'sfx/battle.mp3');
        this.load.audio('defeat', 'sfx/defeat.mp3');
        this.load.audio('victory', 'sfx/victory.mp3');
        this.load.audio('spell', 'sfx/spell.mp3');
        this.load.audio('experience', 'sfx/experience.mp3');
        this.load.audio('hurt_girl', 'sfx/hurt-girl.mp3');
        this.load.audio('hurt_boy', 'sfx/hurt-boy.mp3');
        this.load.audio('levelup', 'sfx/levelup.mp3');
        this.load.audio('sparkle', 'sfx/sparkle.wav');
        this.load.audio('heal', 'sfx/heal.mp3');
        this.load.audio('punch', 'sfx/punch.wav');
        this.load.audio('fireball', 'sfx/fireball.mp3');
        this.load.audio('arrow', 'sfx/arrow.wav');
        this.load.audio('bash', 'sfx/bash.wav');
    }

    private loadVfx(): void {
        this.load.image('switch_on', 'vfx/switch_on.png');
        this.load.image('switch_off', 'vfx/switch_off.png');
        this.load.image('background1-mini', 'vfx/backgrounds/background1-mini.png');
        this.load.image('background2-mini', 'vfx/backgrounds/background2-mini.png');
        this.load.image('background3-mini', 'vfx/backgrounds/background3-mini.png');
        this.load.image('background4-mini', 'vfx/backgrounds/background4-mini.png');
        this.load.image('background1', 'vfx/backgrounds/background1.png');
        this.load.image('background2', 'vfx/backgrounds/background2.png');
        this.load.image('background3', 'vfx/backgrounds/background3.png');
        this.load.image('background4', 'vfx/backgrounds/background4.png');
        this.load.image('play_button_enabled', 'vfx/play_button_enabled.png');
        this.load.image('play_button_disabled', 'vfx/play_button_disabled.png');
        this.load.image('experience_icon', 'vfx/experience.png');
        this.load.image('challenged_icon', 'vfx/challenged_icon.png');
        this.load.image('pending_icon', 'vfx/pending_icon.png');
        this.load.image('ingame_icon', 'vfx/ingame_icon.png');
        this.load.image('accept_button', 'vfx/accept_button.png');
        this.load.image('decline_button', 'vfx/decline_button.png');
        this.load.image('exit_button', 'vfx/exit_button.png');
        this.load.image('logo', 'vfx/logo.png');
        this.load.atlas('radar', 'vfx/radar/spritesheet.png', 'vfx/radar/spritesheet.json');
        this.load.atlas('flares', 'vfx/flares/spritesheet.png', 'vfx/flares/spritesheet.json');
    }

    private loadNovice(): void {
        this.load.image('novice_icon', 'role_icons/novice.png');
        this.load.image('attack_icon', 'skills/attack.png');

        this.load.atlas('novice_boy_idle', 'roles/Novice/Boy/Idle/spritesheet.png', 'roles/Novice/Boy/Idle/spritesheet.json');
        this.load.atlas('novice_boy_hurt', 'roles/Novice/Boy/Hurt/spritesheet.png', 'roles/Novice/Boy/Hurt/spritesheet.json');
        this.load.atlas('novice_boy_attacking', 'roles/Novice/Boy/Attacking/spritesheet.png', 'roles/Novice/Boy/Attacking/spritesheet.json');
        this.load.atlas('novice_boy_dead', 'roles/Novice/Boy/Dying/spritesheet.png', 'roles/Novice/Boy/Dying/spritesheet.json');

        this.load.atlas('novice_girl_idle', 'roles/Novice/Girl/Idle/spritesheet.png', 'roles/Novice/Girl/Idle/spritesheet.json');
        this.load.atlas('novice_girl_hurt', 'roles/Novice/Girl/Hurt/spritesheet.png', 'roles/Novice/Girl/Hurt/spritesheet.json');
        this.load.atlas('novice_girl_attacking', 'roles/Novice/Girl/Attacking/spritesheet.png', 'roles/Novice/Girl/Attacking/spritesheet.json');
        this.load.atlas('novice_girl_dead', 'roles/Novice/Girl/Dying/spritesheet.png', 'roles/Novice/Girl/Dying/spritesheet.json');
    }

    private loadArcher(): void {
        this.load.image('archer_icon', 'role_icons/archer.png');
        this.load.image('fire_arrow', 'skills/fire_arrow.png');
        this.load.image('concentration', 'skills/concentration.png');
        this.load.image('ankle_trap', 'skills/ankle_trap.png');
        this.load.image('arrow_vulcan', 'skills/arrow_vulcan.png');

        this.load.atlas('archer_idle', 'roles/Archer/Idle/spritesheet.png', 'roles/Archer/Idle/spritesheet.json');
        this.load.atlas('archer_hurt', 'roles/Archer/Hurt/spritesheet.png', 'roles/Archer/Hurt/spritesheet.json');
        this.load.atlas('archer_attacking', 'roles/Archer/Attacking/spritesheet.png', 'roles/Archer/Attacking/spritesheet.json');
        this.load.atlas('archer_dead', 'roles/Archer/Dying/spritesheet.png', 'roles/Archer/Dying/spritesheet.json');
    }

    private loadBlackMage(): void {
        this.load.image('blackmage_icon', 'role_icons/blackmage.png');
        this.load.image('fire_bolt', 'skills/fire_bolt.png');
        this.load.image('stone_curse', 'skills/stone_curse.png');
        this.load.image('spiritual_mind', 'skills/spiritual_mind.png');
        this.load.image('lord_of_vermillion', 'skills/lord_of_vermillion.png');

        this.load.atlas('blackmage_idle', 'roles/BlackMage/Idle/spritesheet.png', 'roles/BlackMage/Idle/spritesheet.json');
        this.load.atlas('blackmage_hurt', 'roles/BlackMage/Hurt/spritesheet.png', 'roles/BlackMage/Hurt/spritesheet.json');
        this.load.atlas('blackmage_attacking', 'roles/BlackMage/Attacking/spritesheet.png', 'roles/BlackMage/Attacking/spritesheet.json');
        this.load.atlas('blackmage_dead', 'roles/BlackMage/Dying/spritesheet.png', 'roles/BlackMage/Dying/spritesheet.json');
    }

    private loadSwordman(): void {
        this.load.image('swordman_icon', 'role_icons/swordman.png');
        this.load.image('bash', 'skills/bash.png');
        this.load.image('provoke', 'skills/provoke.png');
        this.load.image('protection', 'skills/protection.png');
        this.load.image('berserk', 'skills/berserk.png');

        this.load.atlas('swordman_idle', 'roles/Swordman/Idle/spritesheet.png', 'roles/Swordman/Idle/spritesheet.json');
        this.load.atlas('swordman_hurt', 'roles/Swordman/Hurt/spritesheet.png', 'roles/Swordman/Hurt/spritesheet.json');
        this.load.atlas('swordman_attacking', 'roles/Swordman/Attacking/spritesheet.png', 'roles/Swordman/Attacking/spritesheet.json');
        this.load.atlas('swordman_dead', 'roles/Swordman/Dying/spritesheet.png', 'roles/Swordman/Dying/spritesheet.json');
    }

    private loadWhiteMage(): void {
        this.load.image('whitemage_icon', 'role_icons/whitemage.png');
        this.load.image('heal', 'skills/heal.png');
        this.load.image('dispel', 'skills/dispel.png');
        this.load.image('blessing', 'skills/blessing.png');
        this.load.image('resurrection', 'skills/resurrection.png');

        this.load.atlas('whitemage_idle', 'roles/WhiteMage/Idle/spritesheet.png', 'roles/WhiteMage/Idle/spritesheet.json');
        this.load.atlas('whitemage_hurt', 'roles/WhiteMage/Hurt/spritesheet.png', 'roles/WhiteMage/Hurt/spritesheet.json');
        this.load.atlas('whitemage_attacking', 'roles/WhiteMage/Attacking/spritesheet.png', 'roles/WhiteMage/Attacking/spritesheet.json');
        this.load.atlas('whitemage_dead', 'roles/WhiteMage/Dying/spritesheet.png', 'roles/WhiteMage/Dying/spritesheet.json');
    }
}
