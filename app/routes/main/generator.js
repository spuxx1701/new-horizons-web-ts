import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class GeneratorRoute extends Route {
    @service manager;
    @service generator;
    @service database;

    async model() {
        // In development mode, preload all collections required for initializing a character and generate a dummy character.
        if (this.manager.devMode) {
            await this.database.loadCollection("origin");
            await this.database.loadCollection("constant");
            await this.database.loadCollection("pri-a");
            await this.database.loadCollection("sec-a");
            await this.database.loadCollection("trait");
            await this.database.loadCollection("skill");
            await this.database.loadCollection("ability");
            this.generator.generateDummyCharater();
        }
    }

    beforeModel(transition) {
        // Redirect to the character preset route if the character hasn't been initialized yet
        // Redirection is disabled in devMode
        if (transition.targetName !== "main.generator.preset" && !this.generator.getCharacter() && !this.manager.devMode) {
            this.transitionTo("main.generator.preset");
        }
    }
}
