import JSONSerializer from '@ember-data/serializer/json';

export default class LocalizationSerializer extends JSONSerializer {
    primaryKey = "key";

    // make IDs lower case
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash).toLowerCase();
        return id;
    }
}