import Ember from 'ember';
import JSONSerializer from '@ember-data/serializer/json';

export default class StellarpediaSerializer extends JSONSerializer {
    // dasherize IDs
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash).replace("_", "/");
        id = Ember.String.dasherize(id);
        return id;
    }
}