import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class MainRoute extends Route {
    model() {
        return RSVP.hash({
            localization: this.store.findAll("localization"),
        });
    }
}
