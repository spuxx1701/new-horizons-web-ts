//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-13
// Description:
// This is the instance representation of a trait. For the model, see
// models/identifiables/trait.js
//----------------------------------------------------------------------------//
import Identifiable from "./identifiable";
import { set } from '@ember/object';
import { inject as service } from '@ember/service';

export default class Trait extends Identifiable {
    @service manager;
    @service database;
    @service generator;

    hideRemoveButton = false;

    /**
     * Removes the trait
     * @param  {bool} undoChanges=true (optional) - Whether changes should be undone.
     * @param  {bool} logSuccess=true (optional) - Whether success should bee logged.
     */
    remove({ undoChanges = true, logSuccess = true } = {}) {
        if (undoChanges) {
            if (this.hasLevel) {
                for (let i = 1; i <= this.level; i++) {
                    this.undoChanges({ logSuccess: logSuccess });
                }
            } else {
                this.undoChanges({ logSuccess: logSuccess });
            }

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
                    let primaryAttribute = this.character.getPrimaryAttribute(change.id);
                    if (change.overrideCurrent) {
                        change.oldLevel = this.character.getPrimaryAttributeProperty(change.id, change.type);
                        primaryAttribute.setProperty(change.type, change.level, { override: true, logSuccess: logSuccess });
                    } else {
                        primaryAttribute.setProperty(change.type, change.level, { logSuccess: logSuccess });
                    }
                    break;
                case "sec-a":
                    let secondaryAttribute = this.character.getSecondaryAttribute(change.id);
                    if (change.overrideCurrent) {
                        change.oldLevel = this.character.getSecondaryAttributeProperty(change.id, change.type);
                        secondaryAttribute.setProperty(change.type, change.level, { override: true, logSuccess: logSuccess });
                    } else {
                        econdaryAttribute.setProperty(change.type, change.level, { logSuccess: logSuccess });
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
                    let primaryAttribute = this.character.getPrimaryAttribute(change.id);
                    if (change.overrideCurrent) {
                        primaryAttribute.setProperty(change.type, change.oldLevel, { override: true, logSuccess: logSuccess });
                    } else {
                        primaryAttribute.setProperty(change.type, -change.level, { logSuccess: logSuccess });
                    }
                    break;
                case "sec-a":
                    let secondaryAttribute = this.character.getSecondaryAttribute(change.id);
                    if (change.overrideCurrent) {
                        secondaryAttribute.setProperty(change.type, change.oldLevel, { override: true, logSuccess: logSuccess });
                    } else {
                        secondaryAttribute.setProperty(change.type, -change.level, { logSuccess: logSuccess });
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
    /**
     * Changes the trait's level by the specified value
     * @param  {} value - Can be any positige and negative integer.
     * @param  {} validate=true (optional) - Will check the target value against min and max.
     * @param  {} applyChanges=true (optional) - Should changes be applied?
     * @param  {} logSuccess=true (optional) - Should success be logged?
     */
    setLevel(value, { validate = true, applyChanges = true, logSuccess = true } = {}) {
        let targetLevel = this.level + value;
        if (validate && targetLevel < this.minLevel) {
            this.manager.log(`Cannot change level of trait '${this.id}}' for character '${this.character.getName()}' by ${value}: Target level would be lower than the minimum level.`, "x");
            return undefined;
        } else if (validate && targetLevel > this.maxLevel) {
            this.manager.log(`Cannot change level of trait '${this.id}}' for character '${this.character.getName()}' by ${value}: Target level would be higher than the maximum level.`, "x");
            return undefined;
        }
        if (value < 0) {
            let abs = Math.abs(value);
            for (let i = 1; i <= abs; i++) {
                this._decrementLevel({ applyChanges: applyChanges, logSuccess: logSuccess });
            }
        } else {
            for (let i = 1; i <= value; i++) {
                this._incrementLevel({ applyChanges: applyChanges, logSuccess: logSuccess });
            }
        }
        return this;
    }

    _incrementLevel({ applyChanges = true, logSuccess = true } = {}) {
        let oldLevel = this.level;
        set(this, "level", this.level + 1);
        if (logSuccess) {
            this.manager.log(`Level of trait '${this.id}}' for character '${this.character.getName()}' has changed from ${oldLevel} to ${this.level}.`);
        }
        if (applyChanges) {
            this.applyChanges({ logSuccess: logSuccess });
        }
    }

    _decrementLevel({ applyChanges = true, logSuccess = true } = {}) {
        let oldLevel = this.level;
        set(this, "level", this.level - 1);
        if (logSuccess) {
            this.manager.log(`Level of trait '${this.id}}' for character ${this.character.getName()} has changed from ${oldLevel} to ${this.level}.`);
        }
        if (applyChanges) {
            this.undoChanges({ logSuccess: logSuccess });
        }
    }
}