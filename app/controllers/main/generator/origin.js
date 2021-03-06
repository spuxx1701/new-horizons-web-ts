
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import { computed, set } from '@ember/object';

export default class MainGeneratorOriginController extends Controller {
    @service manager;
    @service database;
    @service stellarpediaService;
    @service generator;
    @tracked changeset = Changeset({});

    init() {
        super.init();
    }

    @action onChangeOrigin(selectedItem, index) {
        this.set("model.selectedOrigin", this.database.getIdentifiable(selectedItem.id));
        this.set("model.selectedStellarpediaEntry", this.stellarpediaService.get("basic-rules", "supplement-origins", selectedItem.id));
    }

    @action onSubmit() {
        let reducedOriginId = this.get("model.selectedOrigin").id.split("/")[1];
        this.manager.router.transitionTo("main.generator.origin-select", reducedOriginId);
    }
}