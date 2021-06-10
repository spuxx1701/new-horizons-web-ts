import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MainGeneratorAbilitiesRoute extends Route {
    @service manager;
    @service generator;
    @service databaseService;

    model() {
        return RSVP.hash({
            abilities: this.databaseService.loadCollection("ability")
        });
    }
}
