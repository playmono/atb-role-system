import Character from "./Character";

export default class QueueManager {
    static queue: Array<Character> = [];

    static addTurn(character: Character) {
        if (QueueManager.queue.length > 0) {
            QueueManager.queue.push(character);
            return;
        }

        QueueManager.queue.push(character);

        character.skills.forEach((skill) => {
            let skillSprite = character.sprite.scene.add.sprite(
                character.sprite.scene.cameras.main.centerX,
                character.sprite.scene.cameras.main.centerY,
                skill.spriteName
            ).setInteractive();
            skillSprite.scale = 0.5;
            character.sprite.scene.input.setDraggable(skillSprite);
            /*
            character.sprite.scene.physics.add.collider(
                character.sprite.scene.enemyGroup,
                skillSprite
            );
            */
        });
    }
}
