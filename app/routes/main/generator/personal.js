import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MainGeneratorPersonalRoute extends Route {
    @service manager;
    @service("generator-service") generator;
    @service databaseService;

    async model() {
        await this.databaseService.loadCollection("constant");
        return RSVP.hash({
            name: "",
            sex: "",
            age: "",
            birthday: "",
            height: "",
            weight: "",
            appearance: "",
            family: "",
            socialStatus: 1,
            socialStatusMin: 1,
            socialStatusMax: this.databaseService.getIdentifiable("Constant_SocialStatusMax").value
        });
    }
}
