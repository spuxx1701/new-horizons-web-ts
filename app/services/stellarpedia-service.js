// Leopold Hock | 30.04.2020
// Description: This service manages Stellarpedia.
import Ember from 'ember';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class StellarpediaService extends Service {
    @service localizationService;

    namespace = "/assets/stellarpedia/stellarpedia_";
    @tracked data;

    init() {
        super.init();
        this.load();
    }

    // load stellarpedia model
    async load() {
        if (this.stellarpedia) {
            return this.stellarpedia;
        } else {
            let url = this.namespace + this.localizationService.currentLocalization + ".json";
            let result = await fetch(url).then(function (response) {
                return response.json();
            });
            this.data = result;
            return result;
        }
    }
}
