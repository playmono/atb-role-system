import Ally from "./Characters/Ally";

export default class Experience {
    private experienceStop: boolean = false;

    static field: Phaser.Geom.Rectangle;
    static icon: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;

    public constructor(field: Phaser.Geom.Rectangle) {
        Experience.field = field;
    }

    public render(scene: Phaser.Scene) {
        Experience.icon = scene.physics.add.sprite(0, 0, 'experience_icon')
            .setScale(0.25);
        
        Experience.icon['__parentClass'] = this;
        
        this.activate();
    }

    public activate() {
        if (this.experienceStop) {
            return;
        }

        const rndPoint = Experience.field.getRandomPoint();

        Experience.icon.enableBody(true, rndPoint.x,rndPoint.y, true, true);
    }

    public deactivate() {
        Experience.icon.disableBody(true, true);
    }

    public sendToAlly(ally: Ally): void {
        Experience.icon.disableBody(true, false);
        const tween = ally.sprite.scene.tweens.add({
            targets: Experience.icon,
            x: ally.currentRole.roleIcon.x,
            y: ally.currentRole.roleIcon.y,
            ease: {x: 'Quart.In', y: 'Back.in'},
            duration: 100
        });
        tween.on('complete', () => {
            ally.addExperience(100);
            this.deactivate();
        });

        const rnd = Phaser.Math.Between(3000, 5000);
        Experience.icon.scene.time.delayedCall(rnd, this.activate, [], this);
    }

    public stop() {
        this.experienceStop = true;
    }
}
