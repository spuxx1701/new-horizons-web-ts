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
import Character from '../classes/CharacterV1';

export default class GeneratorServiceV1 extends Service {
    @service manager;

    @tracked character;

    @action init() {
        super.init();
    }

    @action initializeGeneration(characterPreset) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-03-13
        // Description:
        // This method is used to initialize character generation.
        //----------------------------------------------------------------------------//
        // let character = new Character({ characterPresetId: characterPreset.id, version: this.manager.appVersion });
        let character = new Character(characterPreset.id, this.manager.appVersion);
        // let character = Ember.getOwner(this).lookup("object: character-v1");
        this.set("character", character);
    }
}