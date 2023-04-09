import Character from "./Character";

export default abstract class CharacterBar {
    static readonly width = 50;
    static readonly height = 10;
    character: Character;
    bar : Phaser.GameObjects.Graphics;

    constructor(character: Character) {
        this.character = character;
    }
}
