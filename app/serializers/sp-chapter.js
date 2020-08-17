import Ember from 'ember';
import JSONSerializer from '@ember-data/serializer/json';
import { EmbeddedRecordsMixin } from '@ember-data/serializer/rest';

export default class StellarpediaChapterSerializer extends JSONSerializer {
    primaryKey = "key";

    // make IDs lower case and dasherize
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash).replace("_", "/");
        id = Ember.String.dasherize(id);
        return id;
    }

    // copy 'id' to '_id' because id's will get stripped in fragments
    /*normalize(typeClass, resourceHash) {
        console.log(resourceHash);
        return super.normalize(typeClass, resourceHash);
    }*/
}