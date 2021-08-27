import DatabasePrefabModel from './prefab';
import { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';
import Trait from "new-horizons-web/identifiables/trait";

export default class DatabaseTraitModel extends DatabasePrefabModel {
    @service manager;
    @service database;
    @service generator;
    @service editor;

    @attr() costs;
    @attr() hasLevel;
    @attr() level;
    @attr() minLevel;
    @attr() maxLevel;
    @attr() hasOptions;
    @attr() selectedOption;
    @attr() options;
    @attr() needsInput;
    @attr() input;
    @attr() targets;
    @attr() requirements;
    @attr() restrictions;

    /**
     * Adds a new trait to the character currently stored in the editor.
     * @param {string} input (optional) - The input of the trait.
     * @param {object} selectedOption (optional) - The selected option of the trait.
     * @param {bool} checkRequirements=false (optional) - Whether requirements should be checked.
     * @param  {bool} isGenerator=false (optional) - Is the process being called from generator or editor?
     * @param {bool} logSuccess=true (optional) - Whether success should be logged.
     * @returns {object} - Returns the added trait or undefined.
     */
    addToCharacter(character, { input, selectedOption, checkRequirements = true, applyChanges = true, isGenerator = false, logSuccess = true } = {}) {
        let newTrait = new Trait({ data: this.database.getIdentifiable(this.id, { clone: true }), character: character, context: this, isGenerator: isGenerator });

        if (character.getTrait(this.id, { input: input, selectedOptionId: selectedOption?.id })) {
            this.manager.log(`Unable to add trait '${this.id}' with input '${input}' and option '${selectedOption?.id}' to character '${character.getName()}': Character already has that trait.`, "x");
            return undefined;
        }

        if (checkRequirements && !character.meetsRequirements(this.requirements)) {
            this.manager.log(`Unable to add trait '${this.id}' with input '${input}' and option '${selectedOption?.id}' to character '${character.getName()}': Requirements not met.`, "e");
            return undefined;
        }

        if (input) {
            newTrait.input = input;
        } else if (selectedOption) {
            newTrait.selectedOption = this.manager.clone(selectedOption);
        }

        if (newTrait.hasLevel) {
            newTrait.level = 1;
        }

        character.data.traits.pushObject(newTrait);

        // Apply changes
        if (applyChanges) {
            newTrait.applyChanges({ logSuccess: logSuccess });
        }

        if (input) {
            if (logSuccess) this.manager.log(`Trait '${newTrait.id}' with input '${newTrait.input}' has been added to character '${character.getName()}'.`, "i");
        } else if (selectedOption) {
            if (logSuccess) this.manager.log(`Trait '${newTrait.id}' with option '${selectedOption.id}' has been added to character '${character.getName()}'.`, "i");
        } else {
            if (logSuccess) this.manager.log(`Trait '${newTrait.id}' has been added to character '${character.getName()}'.`, "i");
        }

        return newTrait;
    }

    characterMeetsRequirements(character) {
        return character.meetsRequirements(this.requirements);
    }
}