//  Leopold Hock | 30.04.2020
//  Description: Controller for template "main/generator/preset". The Preset Route is the start of the Character generation process.

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class GeneratorPresetController extends Controller {
    @service manager;
    @service databaseService;
    @service characterService;

    @tracked selectedPreset;
    @tracked isModified = false;

    init() {
        super.init();
        this.onTransition();
    }

    onTransition() {
        this.onChangePreset(this.manager.constants.characterPresetIdDefault);
        //this.onChangePreset(this.manager.store.peekAll("character-preset").get("firstObject"))
    }

    @action onChangePreset(itemId) {
        this.selectedPreset = this.manager.getIdentifiable(itemId);
        this.isModified = false;
    }
}