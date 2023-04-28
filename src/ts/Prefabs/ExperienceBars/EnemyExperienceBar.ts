import ExperienceBar from "../ExperienceBar";

export default class EnemyExperienceBar extends ExperienceBar {
    private static instance: EnemyExperienceBar;
    bar : Phaser.GameObjects.Graphics;
    box: Phaser.GameObjects.Graphics;
    text: Phaser.GameObjects.Text;

    private constructor() {
        super();
    }

    static getExperienceBar(): EnemyExperienceBar {
        if (!EnemyExperienceBar.instance) {
            EnemyExperienceBar.instance = new EnemyExperienceBar();
        }

        return EnemyExperienceBar.instance;
    }

    render(scene: Phaser.Scene): void {
        this.bar = scene.add.graphics();
		this.box = scene.add.graphics();
		this.box.fillStyle(0x222222, 0.8);
		this.box.fillRect(20, 30, 320, 10);

        //currentWidth = Math.floor(Math.random() * (CharacterBar.width / 2 + 1) + 0);

        this.bar.fillStyle(0xffffff, 1);
        this.bar.fillRect(20, 30, 30, 10);

        this.text = scene.add.text(
            20,
            15,
            "Experience",
            {fontSize: "10"}
        );
    }
}
