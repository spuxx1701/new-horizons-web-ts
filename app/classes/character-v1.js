//----------------------------------------------------------------------------//
// Leopold Hock / 2021-03-13
// Description:
// Character Class Version 1.
//----------------------------------------------------------------------------//
import Ember from 'ember';
// import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { set } from '@ember/object';

export default class CharacterV1 {
    manager;

    // @service manager;
    // @service databaseService;

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
        currentConstraint: 0, // The charac
        availableFP: 0,
        totalEP: 0,
        availableEP: 0,

        //----------------------------------------------------------------------------//
        // Collections
        primaryAttributes: [],
        secondaryAttributes: [],
        traits: [],
        skillCategories: [],
        skills: [],
        abilities: [],
        specialisations: [],
        apps: [],

        //----------------------------------------------------------------------------//
        // Inventory
        inventory: [],
        inventoryWeight: 0,
        credits: 0
    }

    constructor(characterPresetId, version, manager) {
        // Set the character preset and game version
        this.data.characterPreset = characterPresetId;
        this.data.gameVersion = version;
        this.manager = manager;
        let that = this;
        // Initialize primary attributes
        this.manager.database.getCollection("pri-a").forEach(function (priA) {
            that.data.primaryAttributes.push(that.manager.database.cloneRecord(priA));
        })
        // Initialize secondary attributes
        this.manager.database.getCollection("sec-a").forEach(function (secA) {
            that.data.secondaryAttributes.push(that.manager.database.cloneRecord(secA));
        })
        // Initialize skill categories
        this.manager.database.getCollection("skill-category").forEach(function (skillCategory) {
            that.data.skillCategories.push(that.manager.database.cloneRecord(skillCategory));
        })
        // Add all basic skills
        this.manager.database.getCollection("skill").forEach(function (skill) {
            if (skill.isBasic) {
                that.addSkill(skill.id, { logSuccess: false });
            }
        })
        // Log initialization
        this.manager.log(`Character initialization complete (character preset: ${characterPresetId}, game version: ${version}).`);
    }

    //----------------------------------------------------------------------------//
    // GENERAL
    //----------------------------------------------------------------------------//
    getName() {
        if (this.manager.isNullOrWhitespace(this.data.name)) {
            return 'Anonynmous';
        } else {
            return this.data.name;
        }
    }

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

    getGeneralProperty(property) {
        return this.data[property];
    }

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
    setPrimaryAttributeLevel(id, value, { override = false, logSuccess = true, validate = true, updateDependencies = true, setStart = false } = {}) {
        id = this.manager.database.transformId(id);
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
        if (setStart) {
            set(priA, "start", newValue);
        }
        if (logSuccess) this.manager.log(`Level of primary attribute '${id}' for character '${this.getName()}' has been changed from ${oldValue} to ${priA.current} (updating dependencies: ${updateDependencies}).`, "i");
        if (updateDependencies) {
            this.updatePrimaryAttributeDependencies(id);
        }
        return priA;
    }

    setPrimaryAttributeProperty(id, property, value, { override = false, logSuccess = true } = {}) {
        id = this.manager.database.transformId(id);
        for (let priA of this.data.primaryAttributes) {
            if (priA.id === id) {
                if (priA[property] !== undefined) {
                    let oldValue = priA[property];
                    if (override) {
                        set(priA, property, value);
                    } else {
                        set(priA, property, priA[property] + value);
                    }
                    if (logSuccess) this.manager.log(`Value '${property}' of primary attribute '${id}' for character '${this.getName()}' has changed from '${oldValue}' to '${priA[property]}'.`)
                    return priA;
                }
                this.manager.log(`Unable to change value '${property}' of primary attribute '${id}' for character '${this.getName()}': Property not found.`, "x");
                return undefined;
            }
        }
        this.manager.log(`Unable to change value '${property}' of primary attribute '${id}' for character '${this.getName()}': Primary Attribute not found.`, "x");
        return undefined;
    }

    getPrimaryAttribute(id) {
        id = this.manager.database.transformId(id);
        for (let priA of this.data.primaryAttributes) {
            if (priA.id === id) {
                return priA;
            }
        }
        return undefined;
    }

    updatePrimaryAttributeDependencies(id, { logSuccess = true } = {}) {
        id = this.manager.database.transformId(id);
        let priA = this.getPrimaryAttribute(id);
        if (!priA) {
            this.manager.log(`Unable to update dependencies of primary attribute '${id}' for character '${this.getName()}': Primary Attribute not found.`, "x");
            return undefined;
        }
        // update secondary attributes
        for (let secA of this.data.secondaryAttributes) {
            for (let priA of secA.primaryAttributes) {
                if (this.manager.database.transformId(priA) === id) {
                    this.updateSecondaryAttribute(secA.id, { logSuccess: false });
                    break;
                }
            }
        }
        // update skills
        for (let skill of this.data.skills) {
            for (let priAId of skill.primaryAttributes) {
                if (this.manager.database.transformId(priAId) === id) {
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
        let newValue = Math.round(sum / secA.div);
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
        if (!secA[property]) {
            this.manager.log(`Unable to change '${property}' of secondary attribute '${id}' for character '${this.getName()}': Property not found.`, "x");
            return undefined;
        }
        let oldValue = secA.current;
        if (override) {
            set(secA, property, value);
        } else {
            set(secA, property, secA[property] + value);
        }
        if (logSuccess) this.manager.log(`'${property}' of secondary attribute '${id}' for character '${this.getName()}' has been changed from ${oldValue} to ${secA[property]}.`, "i");
        return secA;
    }

    getSecondaryAttribute(id) {
        id = this.manager.database.transformId(id);
        for (let secA of this.data.secondaryAttributes) {
            if (secA.id === id) {
                return secA;
            }
        }
        return undefined;
    }

    getSecondaryAttributeValue(id, { includeBonus = true } = {}) {
        let secA = this.getSecondaryAttribute(id);
        if (!secA) {
            this.manager.log(`Unable to get value of secondary attribute '${id}' for character '${this.getName()}': Secondary Attribute not found.`, "x");
            return undefined;
        }
        if (includeBonus) {
            return (secA.current + secA.bonus);
        } else {
            return secA.current;
        }
    }

    //----------------------------------------------------------------------------//
    // TRAITS
    //----------------------------------------------------------------------------//
    addTrait(id, { input = undefined, selectedOption = undefined, ignoreDuplicates = true, logSuccess = true } = {}) {
        id = this.manager.database.transformId(id);
        let newTrait = this.manager.database.getIdentifiable(id, { clone: true });
        if (this.getTrait(id, { input: input })) {
            if (ignoreDuplicates) {
                return this.getTrait(id, { input: input });
            } else {
                this.manager.log(`Unable to add trait '${id}' with input '${input}' to character '${this.getName()}': Character already has that trait and ignoreDuplicates was set to 'false'.`, "x");
                return undefined;
            }
        }
        if (input) {
            newTrait.input = input;
        } else if (selectedOption) {
            newTrait.selectedOption = this.manager.clone(selectedOption);
        }
        this.data.traits.push(newTrait);
        if (logSuccess) this.manager.log(`Trait '${newTrait.id}' with input '${newTrait.input}' has been added to character '${this.getName()}'.`, "i");
    }

    removeTrait(id, { input = undefined, selectedOptionId = undefined, logSuccess = true } = {}) {

    }

    getTrait(id, { input = undefined, selectedOptionId = undefined }) {
        id = this.manager.database.transformId(id);
        for (let trait of this.data.traits) {
            if (trait.id === id) {
                if (input && trait.input !== input) {
                    continue;
                } else if (selectedOptionId && selectedOptionId !== trait.selectedOption.id) {
                    continue;
                }
                return trait;
            }
        }
        return undefined;
    }

    //----------------------------------------------------------------------------//
    // SKILLS
    //----------------------------------------------------------------------------//
    addSkill(id, { ignoreDuplicates = true, logSuccess = true, updateSkill = true } = {}) {
        id = this.manager.database.transformId(id);
        let newSkill = this.manager.database.getIdentifiable(id, { clone: true });
        if (!newSkill) {
            this.manager.log(`Unable add skill '${id}' to character '${this.getName()}': ID was given, but skill could not be found in database.`, "x");
            return undefined;
        }
        if (this.getSkill(id)) {
            if (ignoreDuplicates) {
                return this.getSkill(id);
            } else {
                this.manager.log(`Unable to add skill '${newSkill.id}' to character '${this.getName()}': Character already has that skill and ignoreDuplicates was set to 'false'.`, "x");
                return undefined;
            }
        }
        this.data.skills.push(newSkill);
        if (logSuccess) this.manager.log(`Skill '${newSkill.id}' has been added to character '${this.getName()}'.`, "i");
        if (updateSkill) this.updateSkill(id, { logSuccess: false });
        return newSkill;
    }

    setSkillLevel(id, value, { override = false, validate = true, logSuccess = true } = {}) {
        id = this.manager.database.transformId(id);
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
        id = this.manager.database.transformId(id);
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

    getSkill(id) {
        id = this.manager.database.transformId(id);
        for (let skill of this.data.skills) {
            if (skill.id === id) {
                return skill;
            }
        }
        return undefined;
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
        let maxAllowedDiff = this.manager.database.getIdentifiable("Constant_SkillsPriAMaxDiff").value;
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
    addAbility(id, { input = undefined, ignoreDuplicates = true, logSuccess = true } = {}) {
        id = this.manager.database.transformId(id);
        let newAbility = this.manager.database.getIdentifiable(id, { clone: true });
        if (this.getAbility(id, { input: input })) {
            if (ignoreDuplicates) {
                return this.getAbility(id, { input: input });
            } else {
                this.manager.log(`Unable to add ability '${id}' with input '${input}' to character '${this.getName()}': Character already has that ability and ignoreDuplicates was set to 'false'.`, "x");
                return undefined;
            }
        }
        if (input) {
            newAbility.input = input;
        }
        this.data.abilities.push(newAbility);
        if (logSuccess) this.manager.log(`Ability '${newAbility.id}' with input '${newAbility.input}' has been added to character '${this.getName()}'.`, "i");
    }

    getAbility(id, { input = undefined }) {
        id = this.manager.database.transformId(id);
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
}