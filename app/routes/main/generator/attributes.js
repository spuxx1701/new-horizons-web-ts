import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';

export default class MainGeneratorAttributesRoute extends Route {
    @service manager;
    @service("generator-service") generator;
    @service databaseService;

    async model() {
        let primaryAttributes = [];
        let secondaryAttributes = [];
        if (this.generator.getCharacter()) {
            primaryAttributes = this.generator.getCharacter().data.primaryAttributes;
            secondaryAttributes = this.generator.getCharacter().data.secondaryAttributes;
        } else {
            if (this.manager.devMode) {
                await this.databaseService.loadCollection("pri-a").content;
                await this.databaseService.loadCollection("sec-a").content;
                primaryAttributes = this.databaseService.getCollection("pri-a").content;
                secondaryAttributes = this.databaseService.getCollection("sec-a").content;
            }
        }
        let modelPrimaryAttributes = [];
        let modelSecondaryAttributes = [];
        for (let priA of primaryAttributes) {
            modelPrimaryAttributes.push({
                id: priA.id,
                changeset: new Changeset(priA)
            })
        }
        for (let secA of secondaryAttributes) {
            modelSecondaryAttributes.push({
                id: secA.id,
                changeset: new Changeset(secA)
            })
        }
        return RSVP.hash({
            primaryAttributes: modelPrimaryAttributes,
            secondaryAttributes: modelSecondaryAttributes
        });
    }
}
