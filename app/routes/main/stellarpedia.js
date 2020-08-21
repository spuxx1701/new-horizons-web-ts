import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class StellarpediaRoute extends Route {
    @service stellarpediaService;

    async model(params) {
        if (!this.stellarpediaService.data) await this.stellarpediaService.load();
        let fullEntryAdress = params.fullEntryAdress;
        let split = fullEntryAdress.split("+");
        if (split.length >= 3) {
            this.stellarpediaService.setSelectedEntry(split[0], split[1], split[2]);
        } else {
            // throw error
        }
    }
}
