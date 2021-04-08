import Ember from 'ember';
import JSONSerializer from '@ember-data/serializer/json';
import { inject as service } from '@ember/service';

export default class DatabaseSerializer extends JSONSerializer {
    @service databaseService;

    // dasherize model ids
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash);
        id = Ember.String.dasherize(id);
        return id;
    }

    // transform ids in all arrays
    normalize(typeClass, hash) {
        for (let entry of hash.entries) {
            entry.id = this.databaseService.transformId(entry.id);
        }
        return super.normalize(typeClass, hash);
    }
}