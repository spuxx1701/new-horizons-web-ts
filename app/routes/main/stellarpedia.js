import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class StellarpediaRoute extends Route {
    @service manager;
    /*async model() {
        // load stellarpedia model
        await this.manager.stellarpedia.load();
        return this.manager.stellarpedia.data;
    }*/
}
