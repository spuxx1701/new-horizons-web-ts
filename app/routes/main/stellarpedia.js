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
                this.stellarpediaService.set("returnRoute", transition.from.name.split(".")[1]);
            }
        }
        // load model
        if (!this.stellarpediaService.data) await this.stellarpediaService.load();
        // // load the required entry
        // let fullEntryAdress = params.fullEntryAdress;
        // let split = fullEntryAdress.split("+");
        // if (split.length === 3) {
        //     if (this.stellarpediaService.get(split[0], split[1], split[2])) {
        //         this.stellarpediaService.setSelectedEntry(split[0], split[1], split[2]);
        //         // get and load the required database collections
        //         await this.stellarpediaService.loadRequiredDatabaseCollections(split[0], split[1], split[2]);
        //     } else {
        //         throw "entry-not-found";
        //     }
        // } else {
        //     this.manager.log("Address of Stellarpedia entry has a wrong format.", this.manager.msgType.x)
        // }
    }

    // @action error(error, transition) {
    //     if (error === "entry-not-found") {
    //         this.intermediateTransitionTo("/page-not-found");
    //     }
    // }
}
