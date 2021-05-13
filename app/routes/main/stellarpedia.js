import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class StellarpediaRoute extends Route {
    @service manager;
    @service router;
    @service stellarpediaService;
    @service databaseService;

    async model(params, transition) {
        // remember returnRoute
        if (transition.from) {
            if (transition.from.name !== transition.to.name) {
                this.stellarpediaService.set("returnRoute", transition.from.name);
            }
        }
        // load json
        return await this.stellarpediaService.load();
    }
}
