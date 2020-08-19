import Ember from 'ember';
import JSONSerializer from '@ember-data/serializer/json';

export default class StellarpediaSerializer extends JSONSerializer {
    // make IDs lower case and dasherize
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash).replace("_", "/");
        id = Ember.String.dasherize(id);
        return id;
    }
}