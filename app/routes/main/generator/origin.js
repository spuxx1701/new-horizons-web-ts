import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import StellarpediaService from '../../../services/stellarpedia-service';

export default class MainGeneratorOriginRoute extends Route {
    @service manager;
    @service("generator-service") generator;
    @service databaseService;
    @service stellarpediaService;

    async model() {
        await this.stellarpediaService.load();
        await this.databaseService.loadCollection("origin");
        let originId = "origin/earth-urban";
        let disableUi = false;
        if (this.generator.getCharacter() && this.generator.getCharacter().origin) {
            // If the character's origin has already been chosen, show that origin and disable all interactables
            originId = generator.getCharacter().origin;
            disableUi = true;
        }
        return RSVP.hash({
            origins: this.databaseService.loadCollection("origin"),
            selectedOrigin: this.databaseService.getIdentifiable(originId),
            selectedStellarpediaEntry: this.stellarpediaService.get("basic-rules", "supplement-origins", originId),
            disabled: disableUi
        });
    }
}
