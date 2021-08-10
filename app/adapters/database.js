import RESTAdapter from '@ember-data/adapter/rest';
import { inject as service } from '@ember/service';

export default class DatabaseAdapter extends RESTAdapter {
    @service database;
    namespace = "/assets/database/";

    urlForFindAll(modelName, snapshot) {
        let url = this.namespace + "database.json";
        return url;
    }

    // Needs to return false to prevent reloading data
    shouldBackgroundReloadAll(store, snapshotArray) {
        return false;
    }
}