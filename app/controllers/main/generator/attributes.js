
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';

export default class MainGeneratorAttributesController extends Controller {
    @service manager;
    @service database;
    @service generator;

    init() {
        super.init();
    }

    @action onChange(event, { object, step } = {}) {
        if (this.generator.getCharacter().setPrimaryAttributeLevel(object.id, step) !== undefined) {
            this.generator.setAp(-1 * step);
        }
    }
}