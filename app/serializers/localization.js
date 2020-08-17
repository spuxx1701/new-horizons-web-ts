import Ember from 'ember';
import JSONSerializer from '@ember-data/serializer/json';

export default class LocalizationSerializer extends JSONSerializer {
    primaryKey = "key";

    // make IDs lower case and dasherize
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash).replace("_", "/");
        id = Ember.String.dasherize(id);
        //let id = super.extractId(modelClass, resourceHash).toLowerCase();
        return id;
    }
}