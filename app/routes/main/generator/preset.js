import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MainGeneratorPresetRoute extends Route {
    @service databaseService;

    model() {
        return RSVP.hash({
            characterPresets: this.databaseService.loadCollection("character-preset"),
            constants: this.databaseService.loadCollection("constant"),
            primaryAttributes: this.databaseService.loadCollection("pri-a"),
            secondaryAttributes: this.databaseService.loadCollection("sec-a"),
            skillCategories: this.databaseService.loadCollection("skill-category")
        });
    }

    @action
    didTransition() {
        return true;
    }
}
