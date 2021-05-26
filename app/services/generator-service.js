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

export default class GeneratorService extends Service {
    @service manager;
    @service databaseService;

    @tracked character;
    @tracked preset;
    @tracked generationInProcess = false;
    @tracked originChosen = false;

    @tracked apAvailable;
    @tracked ipAvailable;
    @tracked ipTotal;

    @tracked gpAvailable;
    @tracked gpBonus;

    getCharacter() {
        return this.get("character");
    }

    @action initializeGeneration(characterPreset) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-03-13
        // Description:
        // This method is used to initialize character generation.
        //----------------------------------------------------------------------------//
        let character = new Character(characterPreset.id, this.manager.appVersion, this.manager);
        this.set("preset", characterPreset);
        this.set("character", character);
        this.manager.goToRoute("generator.origin");
        this.set("generationInProcess", true);
        this.set("originChosen", false);
        // initialize gp, ap and ip budgets
        this.apAvailable = characterPreset.get("apAvailable");
        this.gpAvailable = 0 + characterPreset.get("gpBonus");
        this.ipAvailable = characterPreset.get("ipAvailable");
    }

    setOrigin(origin, motherTongue, skillChoices) {
        // set origin
        this.getCharacter().data.origin = origin.id;
        // increase the special primary attribute
        this.getCharacter().setPrimaryAttributeProperty(origin.specialPA, "current", 1, { logSuccess: false });
        this.getCharacter().setPrimaryAttributeProperty(origin.specialPA, "start", 1, { logSuccess: false });
        this.getCharacter().setPrimaryAttributeProperty(origin.specialPA, "min", 1, { logSuccess: false });
        this.getCharacter().setPrimaryAttributeProperty(origin.specialPA, "max", 1, { logSuccess: false });
        // add and/or increase all fixed skills
        for (let skill of origin.skillsFixed) {
            this.getCharacter().addSkill(skill.id, { logSuccess: false });
            this.getCharacter().setSkillLevel(skill.id, skill.level, { logSuccess: false, updateSkill: false });
            this.getCharacter().updateSkill(skill.id, { logSuccess: false, updateMinimum: true });
        }
        // add and/or increase all chosen skills
        for (let skill of skillChoices) {
            this.getCharacter().addSkill(skill.id, { logSuccess: false });
            this.getCharacter().setSkillLevel(skill.id, skill.level, { logSuccess: false, updateSkill: false });
            this.getCharacter().updateSkill(skill.id, { logSuccess: false, updateMinimum: true });
        }
        // add the character's mother tongue as an ability
        this.getCharacter().addAbility("Ability_General_Language", { input: motherTongue, logSuccess: false });
        this.manager.log(`Applied origin '${origin.id}' to character '${this.getCharacter().getName()}'.`);
        // update status
        this.set("originChosen", true);
    }

    @action logStatus() {
        console.log(this.getCharacter().data);
    }

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
}