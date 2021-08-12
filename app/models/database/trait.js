import DatabasePrefabModel from './prefab';
import { attr } from '@ember-data/model';
import { inject as service } from '@ember/service';

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
    * @param {bool} logSuccess=true (optional) - Whether success should be logged.
    * @returns {object} - Returns the added trait or undefined.
    */
    addToCharacter(character, { input, selectedOption, checkRequirements = true, logSuccess = true } = {}) {
        let newTrait = this.database.getIdentifiable(this.id, { clone: true });

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

        character.data.traits.pushObject(newTrait);

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

    /**
     * Applies changes from a trait or ability that targets other values.
     * @param  {Object} character - The character for which the changes should be applied.
     * @param  {Object[]} changes - The array of changes to apply. Single objects also supported.
     * @param  {bool} isGenerator=false (optional) - Is the process being called from generator or editor?
     * @param  {bool} logSuccess=true (optional) - Should success be logged?
     */
    applyChanges(character, changes, { isGenerator = false, logSuccess = true } = {}) {
        if (!Array.isArray(changes)) {
            changes = [changes];
        }
        for (let change of changes) {
            let collectionName = this.manager.database.getCollectionNameFromId(change.id);
            switch (collectionName) {
                case "pri-a":
                    if (change.overrideCurrent) {
                        change.oldLevel = character.getPrimaryAttributeProperty(change.id, type);
                        character.setPrimaryAttributeProperty(change.id, change.type, change.level, { override = true, logSuccess = logSuccess } = {});
                    } else {
                        character.setPrimaryAttributeProperty(change.id, change.type, change.level, { logSuccess = logSuccess } = {});
                    }
                    break;
                case "sec-a":
                    if (change.overrideCurrent) {
                        change.oldLevel = character.getSecondaryAttributeProperty(change.id, type);
                        character.setSecondaryAttributeProperty(change.id, change.type, change.level, { override = true, logSuccess = logSuccess } = {});
                    } else {
                        character.setSecondaryAttributeProperty(change.id, change.type, change.level, { logSuccess = logSuccess } = {});
                    }
                    break;
                case "skill-category":
                    // This is a special case that has only an effect during generation.
                    if (isGenerator) {
                        generator.setSkillCategoryProperty(change.id, change.type, change.level);
                    }
                    break;
                default:
                    this.manager.log(`Unable to interpret target value with id '${change.id}'.`, "x");
            }
        }
    }

    /**
     * Undoes changes from a trait or ability that targets other values.
     * @param  {Object} character - The character for which the changes should be undone.
     * @param  {Object[]} changes - The array of changes to undo. Single objects also supported.
     * @param  {bool} isGenerator=false (optional) - Is the process being called from generator or editor?
     * @param  {bool} logSuccess=true (optional) - Should success be logged?
     */
    undoChanges(character, changes, { isGenerator = false, logSuccess = true } = {}) {
        if (!Array.isArray(changes)) {
            changes = [changes];
        }
        for (let change of changes) {
            let collectionName = this.manager.database.getCollectionNameFromId(change.id);
            switch (collectionName) {
                case "pri-a":
                    if (change.overrideCurrent) {
                        character.setPrimaryAttributeProperty(change.id, change.type, change.oldLevel, { override = true, logSuccess = logSuccess } = {});
                    } else {
                        character.setPrimaryAttributeProperty(change.id, change.type, -change.level, { logSuccess = logSuccess } = {});
                    }
                    break;
                case "sec-a":
                    if (change.overrideCurrent) {
                        character.setSecondaryAttributeProperty(change.id, change.type, change.oldLevel, { override = true, logSuccess = logSuccess } = {});
                    } else {
                        character.setSecondaryAttributeProperty(change.id, change.type, -change.level, { logSuccess = logSuccess } = {});
                    }
                    break;
                case "skill-category":
                    // This is a special case that has only an effect during generation.
                    if (isGenerator) {
                        generator.setSkillCategoryProperty(change.id, change.type, -change.level);
                    }
                    break;
                default:
                    this.manager.log(`Unable to interpret target value with id '${change.id}'.`, "x");
            }
        }
    }
}