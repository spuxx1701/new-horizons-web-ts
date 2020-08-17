import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class StellarpediaRoute extends Route {
    @service manager;

    model() {
        // load stellarpedia model
        let model = this.store.findAll("stellarpedia");
        return model;
    }
}
