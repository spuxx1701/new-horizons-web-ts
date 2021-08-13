//----------------------------------------------------------------------------//
// Leopold Hock / 2021-03-13
// Description:
// Character Class Version 1.
//----------------------------------------------------------------------------//
import CustomObject from 'new-horizons-web/classes/custom-object';
import { A } from '@ember/array';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { get, computed, set } from '@ember/object';

export default class CharacterV1 extends CustomObject {
    @service manager;
    @service generator;
    @service editor;
    @service database;

    @tracked data = {
        //----------------------------------------------------------------------------//
        // General stuff
        gameVersion: "", // The game version with that the character has been used last.
        generatorPreset: "", // The id of the character preset the character has been created with.

        //----------------------------------------------------------------------------//
        // Personal stuff
        name: "", // The character's full name.
        sex: "", // The character's sex/gender.
        age: "", // The character's age.
        birthday: "", // The character's birthday.
        height: "", // The character's height.
        weight: "", // The character's weight.
        appearance: "", // The character's general apperance.
        family: "", // Some information about the character's family or heritage.
        origin: "", // The character's origin.
        socialStatus: 1, // The character's general social status.

        //----------------------------------------------------------------------------//
        // Status and Experience
        currentConstraint: 0,
        fpAvailable: 0,
        epTotal: 0,
        epAvailable: 0,

        //----------------------------------------------------------------------------//
        // Collections
        primaryAttributes: A([]),
        secondaryAttributes: A([]),
        traits: A([]),
        skills: A([]),
        abilities: A([]),
        specialisations: A([]),
        apps: A([]),

        //----------------------------------------------------------------------------//
        // Inventory
        inventory: A([]),
        inventoryWeight: 0,
        credits: 0
    }

    /**
     * Represents a character that can kept during the session and exported to JSON.
     * @param  {string} characterPresetId
     * @param  {string} version
     * @param  {Object} context
     */
    constructor(characterPresetId, version, { context } = {}) {
        super({ context: context });
        // Set the character preset and game version
        this.data.characterPreset = characterPresetId;
        this.data.gameVersion = version;
        // Log initialization
        this.manager.log(`Character initialization complete (character preset: ${characterPresetId}, game version: ${version}).`);
    }

    //----------------------------------------------------------------------------//
    // GENERAL
    //----------------------------------------------------------------------------//
    /**
     * Sets the character's name.
     */
    getName() {
        if (this.manager.isNullOrWhitespace(this.data.name)) {
            return 'Anonynmous';
        } else {
            return this.data.name;
        }
    }

    /**
     * Sets a general property.
     * @param  {string} property - The property key.
     * @param  {*} value - The new property value.
     * @param  {bool} override=true - Whether the new value should be overridden. 'false' only works on numbers.
     * @param  {bool} checkType=true - Whether the type of the new value should be checked against the old one.
     * @param  {bool} logSuccess=true - Whether success should be logged.
     * @param  {bool} logOldValue=false - Whether the old value should be logged. Only works with 'logSuccess = true'.
     * @returns {*} - Returns the property value or undefined.
     */
    setGeneralProperty(property, value, { override = true, checkType = true, logSuccess = true, logOldValue = false } = {}) {
        if (this.data[property] !== undefined) {
            if (typeof this.data[property] !== typeof value && checkType) {
                this.manager.log(`Unable to change property '${property}' for character '${this.getName()}': Types don't match (got '${typeof value}', expected '${typeof this.data[property]}').`, "x");
                return undefined;
            }
            let oldValue = this.data[property];
            if (!override && typeof value === "number" && typeof this.data[property] === "number") {
                let newValue = this.data[property] += value;
                set(this, property, newValue);
            } else {
                set(this.data, property, value);
            }
            if (logSuccess) {
                if (logOldValue) {
                    this.manager.log(`Property '${property}' for character '${this.getName()}' has been changed from '${oldValue}' to '${this.data[property]}'.`, "i");
                } else {
                    this.manager.log(`Property '${property}' for character '${this.getName()}' has been changed to '${this.data[property]}'.`, "i");
                }
            }
            return this.data[property];
        } else {
            this.manager.log(`Unable to change property '${property}' for character '${this.getName()}': Property not found.`, "x");
            return undefined;
        }
    }
    /**
     * Gets a general property.
     * @param  {string} property - The propert key.
     * @returns {*} - Returns the property value or undefined.
     */
    getGeneralProperty(property) {
        return this.data[property];
    }


    /**
     * Recalculates and updates all properties.
     * @param  {bool} logSuccess=true - Whether success should be logged.
     * @param  {bool} updateSkillMinima=true - Whether skill minima should be updated.
     */
    recalculate({ logSuccess = true, updateSkillMinima = true } = {}) {
        // update secondary attributes
        for (let secA of this.data.secondaryAttributes) {
            this.updateSecondaryAttribute(secA.id, { logSuccess: logSuccess });
        }
        // update skills
        for (let skill of this.data.skills) {
            this.updateSkill(skill.id, { logSuccess: logSuccess, updateMinimum: updateSkillMinima });
        }
    }

    //----------------------------------------------------------------------------//
    // PRIMARY ATTRIBUTES
    //----------------------------------------------------------------------------//
    /**
     * Sets a skill's level.
     * @param  {string} id - The id of the skill.
     * @param  {number} value - The level value. Can be used for addition, substraction or replace the previous value.
     * @param  {bool} override=false - Whether the old level value should be overriden.
     * @param  {bool} logSuccess=true - Whether success should be logged.
     * @param  {bool} validate=true - Whether skill level should be checked against minimum and maximum value.
     * @param  {bool} updateDependencies=true - Whether dependencies should be updated.
     */
    setPrimaryAttributeLevel(id, value, { override = false, logSuccess = true, validate = true, updateDependencies = true } = {}) {
        id = this.database.transformId(id);
        let priA = this.getPrimaryAttribute(id);
        if (!priA) {
            this.manager.log(`Unable to change level of primary attribute '${id}' for character '${this.getName()}': Primary Attribute not found.`, "x");
            return undefined;
        }
        let oldValue = priA.current;
        let newValue = priA.current;
        if (override) {
            newValue = value;
        } else {
            newValue += value;
        }
        if (validate) {
            if (newValue > priA.max) {
                this.manager.log(`Unable to change level of primary attribute '${id}' for character '${this.getName()}': New value ${newValue} would exceed maximum value ${priA.max}.`, "w");
                return undefined;
            } else if (newValue < priA.min) {
                this.manager.log(`Unable to change level of primary attribute '${id}' for character '${this.getName()}': New value ${newValue} would subceed minimum value ${priA.min}.`, "w");
                return undefined;
            }
        }
        set(priA, "current", newValue);
        if (logSuccess) this.manager.log(`Level of primary attribute '${id}' for character '${this.getName()}' has been changed from ${oldValue} to ${priA.current} (updating dependencies: ${updateDependencies}).`, "i");
        if (updateDependencies) {
            this.updatePrimaryAttributeDependencies(id);
        }
        return priA;
    }

    /**
     * Sets a primary attribute's property. Can be any (number) property.
     * @param  {string} id - The attribute's id.
     * @param  {string} property - The property's name.
     * @param  {number} value - The new value. Can be used for addition, substraction or replace the previous value.
     * @param  {bool} override=false - Whether the old value should be replaced.
     * @param  {bool} logSuccess=true - Whether success should be logged.
     * @param  {bool} updateCurrent=true - Whether success should be logged.
     * @param  {bool} updateGeneratorBudget=true - Whether success should be logged.
     * @returns {object} - Returns the updated primary attribute or undefined.
     */
    setPrimaryAttributeProperty(id, property, value, { override = false, logSuccess = true, updateCurrent = true, updateGeneratorBudget = true } = {}) {
        id = this.database.transformId(id);
        for (let priA of this.data.primaryAttributes) {
            if (priA.id === id) {
                if (priA[property] !== undefined) {
                    let oldValue = priA[property];
                    if (override) {
                        set(priA, property, value);
                    } else {
                        set(priA, property, priA[property] + value);
                    }
                    let oldCurrent = priA.current;
                    // Update current value if required
                    if (updateCurrent) {
                        if (property === "min" && priA.current < priA.min) {
                            this.setPrimaryAttributeLevel(priA.id, priA.min, { override: true });
                        } else if (property === "max" && priA.current > priA.max) {
                            this.setPrimaryAttributeLevel(priA.id, priA.max, { override: true });
                        }
                        // Update generator budget if required
                        if (updateGeneratorBudget && this.generator) {
                            this.generator.setAp(oldCurrent - priA.current)
                        }
                    }
                    if (logSuccess) this.manager.log(`'${property}' of primary attribute '${id}' for character '${this.getName()}' has changed from '${oldValue}' to '${priA[property]}'.`)
                    return priA;
                }
                this.manager.log(`Unable to change '${property}' of primary attribute '${id}' for character '${this.getName()}': Property not found.`, "x");
                return undefined;
            }
        }
        this.manager.log(`Unable to change '${property}' of primary attribute '${id}' for character '${this.getName()}': Primary Attribute not found.`, "x");
        return undefined;
    }

    getPrimaryAttribute(id) {
        id = this.database.transformId(id);
        for (let priA of this.data.primaryAttributes) {
            if (priA.id === id) {
                return priA;
            }
        }
        return undefined;
    }

    getPrimaryAttributeProperty(id, property) {
        let priA = this.getPrimaryAttribute(id);
        if (priA) {
            return priA[property];
        } else {
            return undefined;
        }
    }

    updatePrimaryAttributeDependencies(id, { logSuccess = true } = {}) {
        id = this.database.transformId(id);
        let priA = this.getPrimaryAttribute(id);
        if (!priA) {
            this.manager.log(`Unable to update dependencies of primary attribute '${id}' for character '${this.getName()}': Primary Attribute not found.`, "x");
            return undefined;
        }
        // update secondary attributes
        for (let secA of this.data.secondaryAttributes) {
            for (let priA of secA.primaryAttributes) {
                if (this.database.transformId(priA) === id) {
                    this.updateSecondaryAttribute(secA.id, { logSuccess: false });
                    break;
                }
            }
        }
        // update skills
        for (let skill of this.data.skills) {
            for (let priAId of skill.primaryAttributes) {
                if (this.database.transformId(priAId) === id) {
                    this.updateSkill(skill.id, { logSuccess: false, updateMinimum: false });
                    break;
                }
            }
        }
    }

    //----------------------------------------------------------------------------//
    // SECONDARY ATTRIBUTES
    //----------------------------------------------------------------------------//
    updateSecondaryAttribute(id, { logSuccess = true } = {}) {
        let secA = this.getSecondaryAttribute(id);
        if (!secA) {
            this.manager.log(`Unable to update secondary attribute '${id}' for character '${this.getName()}': Secondary Attribute not found.`, "x");
            return undefined;
        }
        let sum = 0;
        for (let priAId of secA.primaryAttributes) {
            let priA = this.getPrimaryAttribute(priAId);
            if (!priA) {
                this.manager.log(`Unable to update secondary attribute '${id}' for character '${this.getName()}': Secondary Attribute not found.`, "x");
                return undefined;
            }
            sum += priA.current;
        }
        let newValue = Math.round((sum / secA.div) * 10 / 10);
        if (newValue !== secA.current) {
            this.setSecondaryAttributeProperty(id, "current", newValue, { logSuccess: logSuccess, override: true });
        }
        return secA;
    }

    setSecondaryAttributeProperty(id, property, value, { logSuccess = true, override = false } = {}) {
        let secA = this.getSecondaryAttribute(id);
        if (!secA) {
            this.manager.log(`Unable to change '${property}' of secondary attribute '${id}' for character '${this.getName()}': Secondary Attribute not found.`, "x");
            return undefined;
        }
        if (secA[property] === undefined) {
            this.manager.log(`Unable to change '${property}' of secondary attribute '${id}' for character '${this.getName()}': Property not found.`, "x");
            return undefined;
        }
        let oldValue = secA[property];
        if (override) {
            set(secA, property, value);
        } else {
            set(secA, property, secA[property] + value);
        }
        if (logSuccess) this.manager.log(`'${property}' of secondary attribute '${id}' for character '${this.getName()}' has been changed from ${oldValue} to ${secA[property]}.`, "i");
        return secA;
    }

    getSecondaryAttribute(id) {
        id = this.database.transformId(id);
        for (let secA of this.data.secondaryAttributes) {
            if (secA.id === id) {
                return secA;
            }
        }
        return undefined;
    }

    getSecondaryAttributeProperty(id, property) {
        let secA = this.getSecondaryAttribute(id);
        return secA[property];
    }

    getSecondaryAttributeCurrent(id, { includeBonus = true } = {}) {
        let secA = this.getSecondaryAttribute(id);
        if (!secA) {
            this.manager.log(`Unable to get value of secondary attribute '${id}' for character '${this.getName()}': Secondary Attribute not found.`, "x");
            return undefined;
        }
        let result = secA.current;
        if (includeBonus) {
            result += secA.bonus;
        }
        if (result < 1) result = 1;
        return result;
    }

    //----------------------------------------------------------------------------//
    // TRAITS
    //----------------------------------------------------------------------------//
    getTrait(id, { input = undefined, selectedOptionId = undefined } = {}) {
        id = this.database.transformId(id);
        for (let trait of this.data.traits) {
            if (trait.id === id) {
                if (trait.needsInput) {
                    if (trait.input === input) return trait;
                } else if (trait.hasOptions) {
                    if (selectedOptionId === trait.selectedOption.id) return trait;
                } else {
                    return trait;
                }
            }
        }
    }

    //----------------------------------------------------------------------------//
    // SKILLS
    //----------------------------------------------------------------------------//

    setSkillLevel(id, value, { override = false, validate = true, logSuccess = true } = {}) {
        id = this.database.transformId(id);
        let skill = this.getSkill(id);
        if (skill) {
            let oldValue = skill.current;
            let newValue = skill.current;
            if (override) {
                newValue = value;
            } else {
                newValue += value;
            }
            // check against max
            if (newValue > skill.max && validate) {
                this.manager.log(`Unable to change level of skill '${id}' for character '${this.getName()}': New value ${newValue} would exceed maximum value ${skill.max}.`, "w");
                return undefined;
            } else if (newValue < skill.min && validate) {
                this.manager.log(`Unable to change level of skill '${id}' for character '${this.getName()}': New value ${newValue} would subceed minimum value ${skill.min}.`, "w");
                return undefined;
            } else {
                set(skill, "current", newValue);
                if (logSuccess) {
                    this.manager.log(`Level of skill '${id}' for character '${this.getName()}' has been changed from ${oldValue} to ${skill.current}.`, "i");
                }
                return skill;
            }
        } else {
            this.manager.log(`Unable to change level of skill '${id}' for character '${this.getName()}': Character does not have that skill.`, "x");
            return undefined;
        }
    }

    setSkillProperty(id, property, value, { override = false, logSuccess = true } = {}) {
        id = this.database.transformId(id);
        let skill = this.getSkill(id);
        if (skill) {
            if (skill[property] !== undefined) {
                let oldValue = skill[property];
                if (override) {
                    set(skill, property, value);
                } else {
                    set(skill, property, skill[property] + value);
                }
                if (logSuccess) {
                    this.manager.log(`Value '${property}' of skill '${id}' for character '${this.getName()}' has been changed from ${oldValue} to ${skill[property]}.`, "i");
                }
                return skill;
            } else {
                this.manager.log(`Unable to change value '${property}' of skill '${id}' for character '${this.getName()}': Property not found`, "x");
                return undefined;
            }
        } else {
            this.manager.log(`Unable to change value '${property}' of skill '${id}' for character '${this.getName()}': Character does not have that skill.`, "x");
            return undefined;
        }
    }

    /**
     * @param  {string} id - The id of the skill.
     * @returns  {Object} - Returns the skill or undefined.
     */
    getSkill(id) {
        id = this.database.transformId(id);
        for (let skill of this.data.skills) {
            if (skill.id === id) {
                return skill;
            }
        }
        return undefined;
    }

    /**
     * @param  {string} id - The id of the skill.
     * @returns  {number} - Returns the skill's level or undefined.
     */
    getSkillLevel(id) {
        let skill = this.getSkill();
        return skill?.current;
    }

    updateSkill(id, { logSuccess = true, updateMinimum = false } = {}) {
        let skill = this.getSkill(id);
        if (!skill) {
            this.manager.log(`Unable to update skill '${id}' for character '${this.getName()}': Character does not have that skill.`, "x");
            return undefined;
        }
        let highestPriA;
        for (let priAId of skill.primaryAttributes) {
            let priA = this.getPrimaryAttribute(priAId);
            if (!highestPriA || priA.current > highestPriA.current) {
                highestPriA = priA;
            }
        }
        if (!highestPriA) {
            this.manager.log(`Unable to update skill '${id}' for character '${this.getName()}': None of the primary attributes could be found.`, "x");
            return undefined;
        }
        let maxAllowedDiff = this.database.getIdentifiable("Constant_SkillsPriAMaxDiff").value;
        let newMax = highestPriA.current + maxAllowedDiff;
        this.setSkillProperty(id, "max", newMax, { override: true, logSuccess: logSuccess });
        if (updateMinimum) {
            this.setSkillProperty(id, "min", skill.current, { override: true, logSuccess: logSuccess });
        }
        return skill;
    }

    //----------------------------------------------------------------------------//
    // ABILITIES
    //----------------------------------------------------------------------------//
    getAbility(id, { input = undefined }) {
        id = this.database.transformId(id);
        for (let ability of this.data.abilities) {
            if (ability.id === id) {
                if (input && ability.input !== input) {
                    continue;
                }
                return ability;
            }
        }
        return undefined;
    }

    //----------------------------------------------------------------------------//
    // APPS
    //----------------------------------------------------------------------------//

    //----------------------------------------------------------------------------//
    // INVENTORY
    //----------------------------------------------------------------------------//

    //----------------------------------------------------------------------------//
    // MISCELLANEOUS
    //----------------------------------------------------------------------------//
    /**
     * Whether the character meets a certain set of requirements. Can return a simple bool or a complex object, including the failed requirements.
     * @param {Object[]} requirements - The requirements array. A single requirement is also supported.
     * @param {bool} detailedResult=false (optional) - Whether a detailed result object should be returned including the requirements that are not met.
     * @returns {bool} OR
     * @returns {Object} { result: {bool}, failedRequirements: {Object[]} };
     */
    meetsRequirements(requirements, { detailedResult = false } = {}) {
        let result = { requirementsMet: true, failedRequirements: [] };
        if (!Array.isArray(requirements)) {
            requirements = [requirements];
        }
        for (let requirement of requirements) {
            let collectionName = this.database.getCollectionNameFromId(requirement.id);
            let requirementFailed = false;
            switch (collectionName) {
                case "pri-a":
                    requirementFailed = (!this.getPrimaryAttribute(requirement.id) || this.getPrimaryAttribute(requirement.id).current < requirement.level);
                    break;
                case "sec-a":
                    requirementFailed = (!this.getSecondaryAttribute(requirement.id) || this.getSecondaryAttributeValue(requirement.id) < requirement.level);
                    break;
                case "trait":
                    requirementFailed = (!this.getTrait(requirement.id, { selectedOptionId: requirement.input }));
                    break;
                case "skill":
                    requirementFailed = (!this.getSkill(requirement.id) || this.getSkillLevel(requirement.id) < requirement.level);
                    break;
                case "ability":
                    requirementFailed = (!this.getAbility(requirement.id));
                    break;
                default:
                    switch (requirement.id) {
                        case "Character_SocialStatus":
                            requirementFailed = this.getGeneralProperty("socialStatus") < requirement.level;
                            break;
                        default:
                            requirementFailed = true;
                            this.manager.log(`Unable to interpret requirement with id '${requirement.id}'.`, "x");
                    }
            }
            if (requirementFailed) {
                result.requirementsMet = false;
                result.failedRequirements.push(requirement);
            }
        }
        if (detailedResult) {
            return result;
        } else {
            return result.requirementsMet;
        }
    }

    /**
     * Whether the character violates a certain set of restrictions. Can return a simple bool or a complex object, including the violated restrictions.
     * @param {Object[]} requirements - The restrictions array. A single restriction is also supported.
     * @param {bool} detailedResult=false (optional) - Whether a detailed result object should be returned including the restrictions that are violated.
     * @returns {bool} OR
     * @returns {Object} { result: {bool}, failedRequirements: {Object[]} };
     */
    violatesRestrictions(restrictions, { detailedResult = false } = {}) {
        let result = { violated: false, violatedRestrictions: [] };
        if (!Array.isArray(restrictions)) {
            restrictions = [restrictions];
        }
        for (let restriction of restrictions) {
            let collectionName = this.database.getCollectionNameFromId(restriction.id);
            let restrictionViolated = false;
            switch (collectionName) {
                case "pri-a":
                    restrictionViolated = this.getPrimaryAttribute(restriction.id) && this.getPrimaryAttribute(restriction.id).current >= restriction.level;
                    break;
                case "sec-a":
                    restrictionViolated = this.getSecondaryAttribute(restriction.id) && this.getSecondaryAttributeValue(restriction.id) >= restriction.level;
                    break;
                case "trait":
                    restrictionViolated = this.getTrait(restriction.id, { selectedOptionId: restriction.input });
                    break;
                case "skill":
                    restrictionViolated = this.getSkill(restriction.id) && this.getSkillLevel(restriction.id) >= restriction.level;
                    break;
                case "ability":
                    restrictionViolated = this.getAbility(restriction.id);
                    break;
                default:
                    switch (collectionName.id) {
                        case "Character_SocialStatus":
                            restrictionViolated = this.getGeneralProperty("socialStatus") < restriction.level;
                            break;
                        default:
                            restrictionViolated = true;
                            this.manager.log(`Unable to interpret restriction with id '${restriction.id}'.`, "x");
                    }
            }
            if (restrictionViolated) {
                result.violated = true;
                result.violatedRestrictions.push(restriction);
            }
        }
        if (detailedResult) {
            return result;
        } else {
            return result.violated;
        }
    }
}