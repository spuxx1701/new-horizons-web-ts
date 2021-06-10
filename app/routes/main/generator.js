import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class GeneratorRoute extends Route {
    @service manager;
    @service generator;

    beforeModel(transition) {
        // Redirect to the character preset route if the character hasn't been initialized yet
        // Redirection is disabled in devMode
        if (transition.targetName !== "main.generator.preset" && !this.generator.getCharacter() && !this.manager.devMode) {
            if (this.manager.devMode) {
                // create some test data
                //this.generator.initializeGeneration({ id: "CharacterPreset_Test" });
                //this.generator.setOrigin()
            } else {
                this.transitionTo("main.generator.preset");
            }
        }
    }
}
