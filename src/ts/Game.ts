import 'phaser';
import Boot from "./Scenes/Boot";
import Preloader from "./Scenes/Preloader";
import MainMenu from "./Scenes/MainMenu";
import SplashScreen from "./Scenes/SplashScreen";
import Utilities from "./Utilities";
import Battlefield from "./Scenes/Battlefied";
import MainSettings from "./Scenes/MainSettings";

const gameConfig: Phaser.Types.Core.GameConfig = {
    width: 360,
    height: 640,
    type: Phaser.CANVAS,
    parent: "content",
    title: "Four Jobs Arena",
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        //mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH
    }
};

export default class Game extends Phaser.Game {
    constructor(config: Phaser.Types.Core.GameConfig) {
        Utilities.LogSceneMethodEntry("Game", "constructor");

        super(config);

        this.scene.add(Boot.Name, Boot);
        this.scene.add(Preloader.Name, Preloader);
        this.scene.add(SplashScreen.Name, SplashScreen);
        this.scene.add(MainMenu.Name, MainMenu);
        this.scene.add(Battlefield.Name, Battlefield);
        this.scene.add(MainSettings.Name, MainSettings);
        this.scene.start(Boot.Name);
    }
}

/**
 * Workaround for inability to scale in Phaser 3.
 * From http://www.emanueleferonato.com/2018/02/16/how-to-scale-your-html5-games-if-your-framework-does-not-feature-a-scale-manager-or-if-you-do-not-use-any-framework/
 */
function resize(): void {
    const canvas = document.querySelector("canvas");
    const width = window.innerWidth;
    const height = window.innerHeight;
    const wratio = width / height;
    const ratio = Number(gameConfig.width) / Number(gameConfig.height);
    if (wratio < ratio) {
        canvas.style.width = width + "px";
        canvas.style.height = (width / ratio) + "px";
    } else {
        canvas.style.width = (height * ratio) + "px";
        canvas.style.height = height + "px";
    }
}

window.onload = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const game = new Game(gameConfig);
    // Uncomment the following two lines if you want the game to scale to fill the entire page, but keep the game ratio.
    resize();
    window.addEventListener("resize", resize, true);
};
