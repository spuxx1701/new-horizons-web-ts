
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';

export default class MainGeneratorOriginController extends Controller {
    @service manager;
    @service databaseService;
    @service("generator-service") generator;
    @tracked changeset = Changeset({});

    init() {
        super.init();
        this.selectOrigin("origin/earth-urban");
    }

    @action onPreviousClick(event) {

    }

    @action onNextClick(event) {

    }

    @action selectOrigin(id) {
    }
}