import RESTAdapter from '@ember-data/adapter/rest';

export default class DatabaseAdapter extends RESTAdapter {
    namespace = "/assets/database/";
    databaseName;

    urlForFindAll(modelName, snapshot) {
        let url = this.namespace + this.databaseName + ".json";
        return url;
    }

    // Needs to return false to prevent reloading data
    shouldBackgroundReloadAll(store, snapshotArray) {
        return false;
    }
}