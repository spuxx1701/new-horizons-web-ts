import Character from 'new-horizons-web/classes/character-v1';
import { module, test } from 'qunit';

module('Unit | Class | character-v1', function (hooks) {
    test('Tests the character class', function (assert) {
        // Get the character instance
        let character = new Character('CharacterPreset_Default', '0.0', { context: this });
        // does the name work?
        assert.equal(character.getName(), "Anonymous");
    });
});