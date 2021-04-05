import RESTAdapter from '@ember-data/adapter/rest';

export default class CollectionAdapter extends RESTAdapter {
    namespace = "/assets/";

    urlForFindAll(modelName, snapshot) {
        return this.namespace + modelName + ".json";
    }

    // Needs to return false to prevent reloading data
    shouldBackgroundReloadAll(store, snapshotArray) {
        return false;
    }

    // Prevent Create and Update
    updateRecord(store, type, snapshot) {
        return snapshot;
    }

    createRecord(store, type, snapshot) {
        return snapshot;
    }
}