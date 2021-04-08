import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MainGeneratorAttributesRoute extends Route {
    @service manager;
    @service("generator-service") generator;
    @service databaseService;

    model() {
        return RSVP.hash({
            primaryAttributes: this.databaseService.loadCollection("pri-a"),
            secondaryAttributes: this.databaseService.loadCollection("sec-a")
        });
    }
}
