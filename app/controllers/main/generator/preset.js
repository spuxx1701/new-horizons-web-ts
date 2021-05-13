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
    @service("generator-service") generator;

    @tracked changeset = Changeset({});
    @tracked allDisabled = true;
    @tracked isModified = false;

    init() {
        super.init();
    }

    @action onChangePreset(id) {
        let item = this.databaseService.getIdentifiable(id);
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
        let that = this;
        // Check whether character generation is currently already running to prevent data loss
        if (this.generator.getCharacter()) {
            // If there is, ask the user whether he wants to restart generation and lose all progress
            let modalParams = {
                type: "warning",
                title: "Modal_RestartGeneration_Title",
                text: ["Modal_RestartGeneration_Text"],
                yesLabel: "Misc_Ok",
                noLabel: "Misc_Cancel"
            };
            let yesListener = {
                "event": "click", "id": "modal-button-footer-yes", "function": function () {
                    that.manager.hideModal();
                    that.changeset.save();
                    that.generator.initializeGeneration(that.changeset.data);
                }
            };
            that.manager.callModal("confirm", modalParams, [yesListener]);

        } else {
            // If there isn't, proceed with initializing the generation
            this.changeset.save();
            this.generator.initializeGeneration(this.changeset.data);
        }
    }
}