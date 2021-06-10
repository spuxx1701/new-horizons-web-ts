import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MainGeneratorTraitsRoute extends Route {
    @service manager;
    @service generator;
    @service databaseService;

    async model() {
        let traitsAvailable = await this.databaseService.loadCollectionAsList("trait");
        await this.databaseService.loadCollection("skill");
        await this.databaseService.loadCollection("constant");
        let traitsOwned = [];
        if (this.generator.originChosen) {
            traitsOwned = this.generator.getCollectionAsList("traits");
        }
        return RSVP.hash({
            traitsAvailable: traitsAvailable,
            traitsOwned: traitsOwned
        });
    }
}
