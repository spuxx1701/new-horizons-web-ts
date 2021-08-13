//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-13
// Description:
// This is the instance representation of a trait. For the model, see
// models/identifiables/trait.js
//----------------------------------------------------------------------------//
import Identifiable from "./identifiable";
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class Trait extends Identifiable {
    @service manager;
    @service database;
    @service generator;

    /**
     * Removes a specific trait.
     * @param  {string} id - The id of the trait.
     * @param  {string} input=undefined input (optional) - The input of the trait.
     * @param  {string} selectedOptionId=undefined (optional) - The selected option of the trait.
     * @param  {bool} undoChanges=true (optional) - Whether changes should be undone.
     * @param  {bool} this.isGenerator=false (optional) - Is the process being called from generator or editor?
     * @param  {bool} logSuccess=true (optional) - Whether success should bee logged.
     */
    remove({ undoChanges = true, logSuccess = true } = {}) {
        if (undoChanges) {
            this.undoChanges({ logSuccess: logSuccess });
        }
        this.character.data.traits.removeObject(this);
        return true;
    }

    /**
     * Applies changes to other values.
     * @param  {bool} logSuccess=true (optional) - Should success be logged?
     */
    applyChanges({ logSuccess = true } = {}) {
        if (this.targets?.length > 0) {
            this._applyChanges(this.targets, { logSuccess: logSuccess });
        }
        if (this.hasOptions && this.selectedOption.targets?.length > 0) {
            this._applyChanges(this.selectedOption.targets, { logSuccess: logSuccess });
        }
    }

    _applyChanges(changes, { logSuccess = true } = {}) {
        for (let change of changes) {
            let collectionName = this.database.getCollectionNameFromId(change.id);
            switch (collectionName) {
                case "pri-a":
                    if (change.overrideCurrent) {
                        change.oldLevel = this.character.getPrimaryAttributeProperty(change.id, type);
                        this.character.setPrimaryAttributeProperty(change.id, change.type, change.level, { override = true, logSuccess = logSuccess } = {});
                    } else {
                        this.character.setPrimaryAttributeProperty(change.id, change.type, change.level, { logSuccess = logSuccess } = {});
                    }
                    break;
                case "sec-a":
                    if (change.overrideCurrent) {
                        change.oldLevel = this.character.getSecondaryAttributeProperty(change.id, type);
                        this.character.setSecondaryAttributeProperty(change.id, change.type, change.level, { override = true, logSuccess = logSuccess } = {});
                    } else {
                        this.character.setSecondaryAttributeProperty(change.id, change.type, change.level, { logSuccess = logSuccess } = {});
                    }
                    break;
                case "skill-category":
                    // This is a special case that has only an effect during generation.
                    if (this.isGenerator) {
                        this.generator.setSkillCategoryProperty(change.id, change.type, change.level);
                    }
                    break;
                default:
                    this.manager.log(`Unable to interpret target value with id '${change.id}'.`, "x");
            }
        }
    }

    /**
     * Undoes changes to other values.
     * @param  {bool} logSuccess=true (optional) - Should success be logged?
     */
    undoChanges({ logSuccess = true } = {}) {
        if (this.targets?.length > 0) {
            this._undoChanges(this.targets, { logSuccess: logSuccess });
        }
        if (this.hasOptions && this.selectedOption.targets?.length > 0) {
            this._undoChanges(this.selectedOption.targets, { logSuccess: logSuccess });
        }
    }

    _undoChanges(changes, { logSuccess = true } = {}) {
        for (let change of changes) {
            let collectionName = this.database.getCollectionNameFromId(change.id);
            switch (collectionName) {
                case "pri-a":
                    if (change.overrideCurrent) {
                        this.character.setPrimaryAttributeProperty(change.id, change.type, change.oldLevel, { override = true, logSuccess = logSuccess } = {});
                    } else {
                        this.character.setPrimaryAttributeProperty(change.id, change.type, -change.level, { logSuccess = logSuccess } = {});
                    }
                    break;
                case "sec-a":
                    if (change.overrideCurrent) {
                        this.character.setSecondaryAttributeProperty(change.id, change.type, change.oldLevel, { override = true, logSuccess = logSuccess } = {});
                    } else {
                        this.character.setSecondaryAttributeProperty(change.id, change.type, -change.level, { logSuccess = logSuccess } = {});
                    }
                    break;
                case "skill-category":
                    // This is a special case that has only an effect during generation.
                    if (this.isGenerator) {
                        this.generator.setSkillCategoryProperty(change.id, change.type, -change.level);
                    }
                    break;
                default:
                    this.manager.log(`Unable to interpret target value with id '${change.id}'.`, "x");
            }
        }
    }
}