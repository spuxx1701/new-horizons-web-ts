//----------------------------------------------------------------------------//
// Leopold Hock / 2021-03-13
// Description:
// Character Class Version 1.
//----------------------------------------------------------------------------//
import Ember from 'ember';
// import EmberObject from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

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
        socialsTatus: "", // The character's general social status.

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
        // super(...arguments);
        // Set the character preset and game version
        this.data.characterPreset = characterPresetId;
        this.data.gameVersion = version;
        this.manager = manager;

        // Initialize primary attributes
        for (let priA of this.manager.database.getCollection("pri-a").content) {
            this.data.primaryAttributes.push(this.manager.database.cloneRecord(priA));
        }
        // Initialize secondary attributes
        for (let secA of this.manager.database.getCollection("sec-a").content) {
            this.data.secondaryAttributes.push(this.manager.database.cloneRecord(secA));
        }
        // Initialize skill categories
        for (let skillCategory of this.manager.database.getCollection("skill-category").content) {
            this.data.skillCategories.push(this.manager.database.cloneRecord(skillCategory));
        }
        // Log initialization
        this.manager.log(`Character initialization complete (character preset: ${characterPresetId}, game version: ${version}).`);
    }
}