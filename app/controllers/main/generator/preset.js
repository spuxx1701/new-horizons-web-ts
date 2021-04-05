//  Leopold Hock | 30.04.2020
//  Description: Controller for template "main/generator/preset". The Preset Route is the start of the Character generation process.

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import EmberResolver from 'ember-resolver';

export default class GeneratorPresetController extends Controller {
    @service manager;
    @service databaseService;
    @service("generator-v1") generator;

    @tracked changeset = Changeset({});
    @tracked allDisabled = true;
    @tracked isModified = false;

    init() {
        super.init();
    }

    @action onChangePreset(id) {
        let item = this.manager.getIdentifiable(id);
        item.set("isCustom", this.changeset.isCustom)
        this.set("changeset", Changeset(item));
        this.isModified = false;
    }

    @action onCustomToggle(event) {
        if (!event.srcElement.checked) {
            // reset preset when 'custom' is being turned off
            this.onChangePreset(this.changeset.get("id"));
        }
    }

    @action onSubmit(event) {
        event.preventDefault();
        this.changeset.save();
        this.generator.initializeGeneration(this.changeset.data);
    }
}