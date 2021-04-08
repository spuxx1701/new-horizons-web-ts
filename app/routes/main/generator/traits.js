import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MainGeneratorTraitsRoute extends Route {
    @service manager;
    @service("generator-service") generator;
    @service databaseService;

    model() {
        return RSVP.hash({
            traits: this.databaseService.loadCollection("trait")
        });
    }
}
