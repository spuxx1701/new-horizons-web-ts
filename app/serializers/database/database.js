import JSONSerializer from '@ember-data/serializer/json';

export default class DatabaseSerializer extends JSONSerializer {
    // make IDs lower case
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash).toLowerCase();
        return id;
    }
}