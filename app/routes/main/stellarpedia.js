import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class StellarpediaRoute extends Route {
    @service manager;

    model() {
        // load stellarpedia model
        let model = this.store.findAll("stellarpedia");
        if (model && model.content) {
            this.manager.log("Stellarpedia model loaded.");
        } else {
            this.manager.log("Stellarpedia model could not be loaded.", "error");
        }
        return model;
    }
}
