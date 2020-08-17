import Ember from 'ember';
import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class StellarpediaSerializer extends JSONSerializer {
    primaryKey = "key";
    /*attrs = {
        chapters: { embedded: 'always' }
    }*/

    // make IDs lower case and dasherize
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash).replace("_", "/");
        id = Ember.String.dasherize(id);
        return id;
    }
}