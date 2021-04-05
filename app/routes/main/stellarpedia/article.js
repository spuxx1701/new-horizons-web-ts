import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class MainStellarpediaArticleRoute extends Route {
    @service manager;
    @service stellarpediaService;

    async model(params, transition) {
        // get the full adress and split it
        let fullEntryAdress = params.fullEntryAdress;
        let split = fullEntryAdress.split("+");
        if (split.length === 3) {
            if (this.stellarpediaService.get(split[0], split[1], split[2])) {
                this.stellarpediaService.setSelectedEntry(split[0], split[1], split[2]);
                // get and load the required database collections
                await this.stellarpediaService.loadRequiredDatabaseCollections(split[0], split[1], split[2]);
            } else {
                throw "entry-not-found";
            }
        } else {
            this.manager.log("Address of Stellarpedia entry has a wrong format.", this.manager.msgType.x)
        }
    }

    @action error(error, transition) {
        if (error === "entry-not-found") {
            this.intermediateTransitionTo("/page-not-found");
        }
    }
}