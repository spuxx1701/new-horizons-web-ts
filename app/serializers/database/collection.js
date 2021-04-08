import Ember from 'ember';
import JSONSerializer from '@ember-data/serializer/json';
import { inject as service } from '@ember/service';

export default class DatabaseCollectionSerializer extends JSONSerializer {
    @service databaseService;

    // dasherize model ids
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash);
        id = Ember.String.dasherize(id);
        return id;
    }

    // transform ids in all arrays
    normalize(typeClass, hash) {
        let transformedId = this.databaseService.transformId(hash.id);
        hash.id = transformedId;
        return super.normalize(typeClass, hash);
    }
}