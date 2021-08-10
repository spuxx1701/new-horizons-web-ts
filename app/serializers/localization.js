import Ember from 'ember';
import JSONSerializer from '@ember-data/serializer/json';
import { inject as service } from '@ember/service';

export default class LocalizationSerializer extends JSONSerializer {
    @service database;

    primaryKey = "key";

    // make IDs lower case and dasherize
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash);
        id = this.database.transformId(id);
        return id;
    }
}