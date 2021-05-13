
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';

export default class MainGeneratorPersonalController extends Controller {
    @service manager;
    @service databaseService;
    @service("generator-service") generator;

    @tracked changeset = Changeset(this.model);

    @action onChange(event, data) {
        data.changeset.save();
        this.generator.getCharacter().setGeneralProperty(data.key, data.changeset.get(data.key), { override: true });
    }
}