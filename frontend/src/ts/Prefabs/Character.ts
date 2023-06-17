import { RolesMap } from "./Constants";
import { Columns, LanePosition, Rows } from "./Enums";
import HealthBar from "./Bars/HealthBar";
import AtbBar from "./Bars/AtbBar";
import Role from "./Role";
import Novice from "./Roles/Novice";
import Archer from "./Roles/Archer";
import Ally from "./Characters/Ally";
import Battlefield from "../Scenes/Battlefied";

export default abstract class Character {
    level: number = 1;
    currentRole: Role;
    currentRoleType: typeof Role;
    readonly row: Rows;
    column: Columns;
    lanePosition: LanePosition = LanePosition.FORWARD;
    sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    healthCurrent: number = 100;
    healthMax: number = 100;
    attackPhysical: number = 10;
    attackMagical: number = 7;
    defensePhysical: number = 4;
    defenseMagical: number = 2;

    private roles: Array<Role> = [];

    healthBar: HealthBar;
    atbBar: AtbBar;
    levelsText: Phaser.GameObjects.Text;
    gender: number;
    topCircle: Phaser.Geom.Circle;

    constructor(gender: number) {
        this.gender = gender;
        this.healthBar = new HealthBar(this);
        this.atbBar = new AtbBar(this);
        this.setRole(Novice);

        for (const roleName in RolesMap) {
            this.roles.push(new RolesMap[roleName]());
        }
    }

    setRole(roleType: any) {
        const found = this.getRole(roleType);
        this.currentRole = found;
        this.currentRoleType = roleType;
    }

    getRole(roleType: any): any {
        const found = this.roles.find((r) => r instanceof roleType);

        if (found) {
            return found;
        }

        const role = new roleType();
        this.roles.push(role);
        return role;
    }

    getRoles(): Array<Role> {
        return this.roles;
    }

    barReady() {
        // Do nothing
    }

    render(scene: Phaser.Scene, column: Columns): Phaser.Types.Physics.Arcade.SpriteWithDynamicBody {
        this.column = column;

        this.sprite = scene.physics.add.sprite(0, 0, '')
            .setOrigin(0.5)
            .setInteractive();

        this.sprite.body.setSize(100, 300);

        // Novices in spritesheet are looking in the other direction, so flip them if column < 2
        this.sprite.flipX = column > 1;

        this.sprite['__parentClass'] = this;

        this.renderRole(scene);
        this.healthBar.render();
        this.atbBar.render();

        return this.sprite;
    }

    renderRole(scene: Phaser.Scene) {
        const idleAnimation = `${this.getBaseAnimation()}_idle`;

        this.sprite.anims.play(idleAnimation);
        this.sprite.scale = this.currentRoleType.spriteScale;

        this.sprite.body.setSize(100, 300);

        const oneThirdY = scene.cameras.main.width / 3;
        const oneQuarterX = scene.cameras.main.width / 6;

        const offsetY = this.row === Rows.BELOW_ROW ? -30 : 0;

        this.sprite.x = oneQuarterX * (this.column * 2 + 1);
        this.sprite.y = oneThirdY * (this.row * 3 + 1) + offsetY + this.currentRoleType.spriteOffsetY;

        const offsetCircle = this.currentRoleType == Archer ? -15 : 10;

        this.topCircle = new Phaser.Geom.Circle(this.sprite.getTopCenter().x, this.sprite.getTopCenter().y + offsetCircle, 40);
        const graphics = this.sprite.scene.add.graphics({ lineStyle: { color: 0x00ff00 } });
        //graphics.strokeCircleShape(this.topCircle);

        this.currentRole.renderIcon(
            this,
            this.currentRole,
            this.topCircle.x,
            this.topCircle.y
        );
    }

    public getBaseAnimation(): string {
        const genderString = this.currentRoleType === Novice ?
            this.gender > 0.5 ? '_boy' : '_girl'
            : '';

        return `${this.currentRoleType.baseAnimation}${genderString}`;
    }

    public levelUp(): void {
        this.level++;
        this.currentRole.levelUp();
    }

    public addExperience(experience: number): void {
        this.currentRole.addExperience(experience);
    }

    public receiveSkill(damage: number): void {
        const anim = this.sprite.play(`${this.getBaseAnimation()}_hurt`);
        anim.on(
            Phaser.Animations.Events.ANIMATION_COMPLETE,
            () => this.sprite.play(`${this.getBaseAnimation()}_idle`),
            this
        );

        let result = this.healthCurrent + damage;

        result = Math.min(result, this.healthMax);
        result = Math.max(result, 0);

        this.healthCurrent = result;

        if (this.healthCurrent <= 0) {
            this.die();
        }

        this.healthBar.update();
    }

    protected die(): void {
        //this.currentRole.destroy();
        //this.sprite.destroy();
        this.atbBar.bar.destroy();
        this.atbBar.progressBox.destroy();
        //this.healthBar.bar.destroy();
        this.sprite.play(`${this.getBaseAnimation()}_dead`);
        const lastFrame = this.sprite.anims.currentAnim.getLastFrame();
        this.sprite.anims.stopOnFrame(lastFrame);

        if (this instanceof Ally) {
            this.endTurn(false);
        }

        const scene = this.sprite.scene as any;
        scene.checkGameOver(false);
    }
}
