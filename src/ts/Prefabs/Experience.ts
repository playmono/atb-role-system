export default class Experience {
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
        const rndPoint = Experience.field.getRandomPoint();

        Experience.icon.enableBody(true, rndPoint.x,rndPoint.y, true, true);
    }

    public deactivate() {
        Experience.icon.disableBody(true, true);
    }

    public restart() {
        this.deactivate();

        const rnd = Phaser.Math.Between(3000, 5000);
        Experience.icon.scene.time.delayedCall(rnd, this.activate, [], this);
    }
}
