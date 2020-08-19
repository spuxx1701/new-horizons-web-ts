import RESTAdapter from '@ember-data/adapter/rest';
import { inject as service } from '@ember/service';

export default class LocalizationAdapter extends RESTAdapter {
    @service localizationService;
    namespace = "/assets/localization/localization_";

    urlForFindAll(modelName, snapshot) {
        let url = this.namespace + this.localizationService.currentLocalization + ".json";
        return url;
    }

    // Needs to return false to prevent reloading data
    shouldBackgroundReloadAll(store, snapshotArray) {
        return false;
    }
}