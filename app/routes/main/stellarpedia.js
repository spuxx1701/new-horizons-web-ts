import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class StellarpediaRoute extends Route {
    @service manager;
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
        if (!this.databaseService.data) await this.databaseService.load();
        let fullEntryAdress = params.fullEntryAdress;
        let split = fullEntryAdress.split("+");
        if (split.length === 3) {
            this.stellarpediaService.setSelectedEntry(split[0], split[1], split[2]);
        } else {
            this.manager.log("Address of Stellarpedia entry has a wrong format.", this.manager.msgType.x)
        }
    }
}
