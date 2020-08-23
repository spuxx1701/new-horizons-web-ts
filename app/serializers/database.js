import Ember from 'ember';
import JSONSerializer from '@ember-data/serializer/json';

export default class DatabaseSerializer extends JSONSerializer {
    // dasherize IDs
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash);
        id = Ember.String.dasherize(id);
        return id;
    }

    // also make IDs in all arrays lower case and dasherized
    normalize(typeClass, hash) {
        for (let entry of hash.entries) {
            entry.id = Ember.String.dasherize(entry.id);
        }
        return super.normalize(typeClass, hash);
    }
}