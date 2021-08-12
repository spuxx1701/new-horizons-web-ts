//----------------------------------------------------------------------------//
// Leopold Hock / 2021-03-13
// Description:
// This service manages the character generation process.
//----------------------------------------------------------------------------//
import Ember from 'ember';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Character from '../classes/character-v1';
import { A } from '@ember/array';

export default class GeneratorService extends Service {
    @service manager;
    @service database;

    @tracked character;
    @tracked preset;
    @tracked generationInProcess = false;
    @tracked originChosen = false;

    @tracked apAvailable;
    @tracked ipAvailable;
    @tracked ipTotal;
    @tracked skillCategories = A([]);

    @tracked gpAvailable;
    @tracked gpBonus;

    @tracked settings = {
        showTutorials: false
    }

    getCharacter() {
        let character = this.get("character");
        return character;
    }

    @action initializeGeneration(characterPreset, { showTutorials = false, preventRouting = false } = {}) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-03-13
        // Description:
        // This method is used to initialize character generation.
        //----------------------------------------------------------------------------//
        let character = new Character(characterPreset.id, this.manager.appVersion, this.manager, { generator: this });
        this.set("preset", characterPreset);
        this.set("character", character);
        if (!preventRouting) {
            this.manager.goToRoute("generator.origin");
        }
        this.set("generationInProcess", true);
        this.set("originChosen", false);
        let that = this;
        // Initialize primary attributes
        this.manager.database.getCollection("pri-a").forEach(function (priA) {
            character.data.primaryAttributes.push(that.manager.database.cloneRecord(priA));
        })
        // Initialize secondary attributes
        this.manager.database.getCollection("sec-a").forEach(function (secA) {
            character.data.secondaryAttributes.push(that.manager.database.cloneRecord(secA));
            character.updateSecondaryAttribute(secA.id, { logSuccess: false });
        })
        // Add all basic skills
        this.manager.database.getCollection("skill").forEach(function (skill) {
            if (skill.isBasic) {
                skill.addToCharacter(character, { logSuccess: false, ignoreDuplicate: true });
            }
        })
        // initialize gp, ap and ip budgets
        this.apAvailable = characterPreset.apAvailable;
        this.gpAvailable = 0 + characterPreset.gpBonus;
        this.ipAvailable = characterPreset.ipAvailable;
        // initialize skill categories
        this.manager.database.getCollection("skill-category").forEach(function (skillCategory) {
            this.skillCategories.pushObject(that.manager.database.cloneRecord(skillCategory));
        })
        // initialize settings
        this.set("showTutorials", showTutorials);
    }

    setOrigin(origin, motherTongue, skillChoices) {
        // set origin
        this.getCharacter().data.origin = origin.id;
        // increase the special primary attribute
        this.getCharacter().setPrimaryAttributeProperty(origin.specialPA, "current", 1, { logSuccess: false });
        this.getCharacter().setPrimaryAttributeProperty(origin.specialPA, "min", 1, { logSuccess: false });
        this.getCharacter().setPrimaryAttributeProperty(origin.specialPA, "max", 1, { logSuccess: false });
        // add and/or increase all fixed skills
        for (let skill of origin.skillsFixed) {
            let skillRecord = this.database.getIdentifiable(skill.id);
            skillRecord.addToCharacter(this.getCharacter(), { logSuccess: false, ignoreDuplicate: true, updateSkill: false });
            this.getCharacter().setSkillLevel(skill.id, skill.level, { logSuccess: false, validate: false, updateSkill: false });
            this.getCharacter().updateSkill(skill.id, { logSuccess: false, updateMinimum: true });
        }
        // add and/or increase all chosen skills
        for (let skill of skillChoices) {
            let skillRecord = this.database.getIdentifiable(skill.id);
            skillRecord.addToCharacter(this.getCharacter(), { logSuccess: false, ignoreDuplicate: true, updateSkill: false });
            this.getCharacter().setSkillLevel(skill.id, skill.level, { logSuccess: false, validate: false, updateSkill: false });
            this.getCharacter().updateSkill(skill.id, { logSuccess: false, updateMinimum: true });
        }
        // add the character's mother tongue as an ability
        let motherTongueAbility = this.database.getIdentifiable("Ability_General_Language");
        motherTongueAbility.addToCharacter(this.getCharacter(), { input: motherTongue, logSuccess: false });

        // update status
        this.manager.log(`Applied origin '${origin.id}' to character '${this.getCharacter().getName()}'.`);
        this.set("originChosen", true);
    }

    @action logStatus() {
        console.log(this.getCharacter().data);
    }

    /**
     * Sets the current generation points.
     * @param  {number} value - The value to override or increase/decrease. Can be negative.
     * @param  {bool} override=false (optional) - Should the previous value be overriden or increased/decreased?
     */
    @action setGp(value, { override = false } = {}) {
        let oldValue = this.gpAvailable;
        if (override) {
            this.set("gpAvailable", value);
        } else {
            this.set("gpAvailable", oldValue + value);
        }
    }

    @action setAp(value, { override = false } = {}) {
        let oldValue = this.apAvailable;
        if (override) {
            this.set("apAvailable", value);
        } else {
            this.set("apAvailable", oldValue + value);
        }
    }

    @action setIp(value, { override = false } = {}) {
        let oldValue = this.ipAvailable;
        if (override) {
            this.set("ipAvailable", value);
        } else {
            this.set("ipAvailable", oldValue + value);
        }
    }

    @action setSkillCategoryProperty(categoryId, property, value) {
        for (let category of this.skillCategories) {
            if (this.database.transformId(category.id) === this.database.transformId(categoryId))
                category[property] += value;
        }
    }

    /**
     * Generates a dummy character for development purposes.
     */
    generateDummyCharater() {
        let preset = {
            id: "Dummy",
            gpBonus: 0,
            apAvailable: 32,
            traitsMin: 5,
            traitsMax: 15,
            abilitiesMax: 4,
            ipAvailable: 100,
            epStart: 0,
            crStart: 0,
            fpStart: 1
        };
        this.initializeGeneration(preset, { preventRouting: true });
        let origin = this.database.getIdentifiable("origin/earth-urban");
        let skillChoices = [];
        for (let skillOption of origin.skillOptions) {
            skillChoices.push({ id: skillOption.options[0], level: skillOption.level })
        }
        this.setOrigin(origin, "Solaire", skillChoices);
    }
}