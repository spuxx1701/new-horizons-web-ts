import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';

export default class MainGeneratorTraitsRoute extends Route {
    @service manager;
    @service("generator-service") generator;
    @service databaseService;

    async model() {
        let collection = await this.databaseService.loadCollection("trait");
        let traitsAvailable = [];
        collection.forEach(function (record) {
            traitsAvailable.push({
                data: record,
                changeset: new Changeset(record)
            })
        });
        return RSVP.hash({
            traitsAvailable: traitsAvailable
        });
    }
}
