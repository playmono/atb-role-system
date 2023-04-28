import Battlefield from "../../Scenes/Battlefied";
import ExperienceBar from "../ExperienceBar";
import AllyQueue from "../Queues/AllyQueue";

export default class AllyExperienceBar extends ExperienceBar {
    private static instance: AllyExperienceBar;
    text: Phaser.GameObjects.Text;
    currentExperience: number = 0;
    totalWidth: number = 320;
    bar : Phaser.GameObjects.Graphics;
    box: Phaser.GameObjects.Graphics;

    private constructor() {
        super();
    }

    static getExperienceBar(): AllyExperienceBar {
        if (!AllyExperienceBar.instance) {
            AllyExperienceBar.instance = new AllyExperienceBar();
        }

        return AllyExperienceBar.instance;
    }

    render(scene: Phaser.Scene): void {
        this.bar = scene.add.graphics();
		this.box = scene.add.graphics();
		this.box.fillStyle(0x222222, 0.8);
		this.box.fillRect(20, 550, this.totalWidth, 10);

        //currentWidth = Math.floor(Math.random() * (CharacterBar.width / 2 + 1) + 0);

        this.bar.fillStyle(0xffffff, 1);
        this.bar.fillRect(20, 550, this.currentExperience, 10);

        this.text = scene.add.text(
            20,
            535,
            "Experience",
            {fontSize: "10"}
        );
    }

    update(experience: number):void {
        if (this.totalWidth === this.currentExperience) {
            return;
        }

        let result = this.currentExperience + experience;

        this.currentExperience = Math.min(this.totalWidth, result);

        this.bar.fillRect(20, 550, this.currentExperience, 10);

        if (this.totalWidth <= this.currentExperience) {
            this.onFullExperience();
        }
    }

    onFullExperience(): void {
        const scene = this.bar.scene;
        this.bar.destroy();
        this.box.destroy();
        this.text.destroy();
        
        const x = scene.cameras.main.centerX;
        const y = 550;

        const levelUp = scene.physics.add.sprite(x, y, 'levelup').setInteractive();
        levelUp.scale = 0.1;
        levelUp['__initialX'] = x;
        levelUp['__initialY'] = y;
        levelUp.body.setCircle(100);
        levelUp.body.setOffset(100,100);
        scene.input.setDraggable(levelUp);

        levelUp.scene.physics.add.overlap(
            levelUp,
            Battlefield.allyGroup,
            this.onOverlap,
            null,
            this
        );
    }

    private onOverlap(
        levelUp: any,
        targetSprite: any
    ): void {
        this.currentExperience = 0;
        const appliedOn = targetSprite.__parentClass;
        appliedOn.levelUp();

        if (AllyQueue.getQueue().getFirst() === appliedOn) {
            Battlefield.turnElements.clear(true, true);
            appliedOn.renderSkills();
            appliedOn.renderRoles();
        }

        levelUp.destroy();
        this.render(targetSprite.scene);
    }
}
