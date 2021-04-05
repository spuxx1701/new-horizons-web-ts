import Ember from 'ember';
import JSONSerializer from '@ember-data/serializer/json';
import { inject as service } from '@ember/service';

export default class StellarpediaSerializer extends JSONSerializer {
    @service databaseService;

    // transform book ids
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash);
        id = this.databaseService.transformId(id);
        return id;
    }

    // also transform chapter and entry ids
    normalize(typeClass, hash) {
        for (let chapter of hash.chapters) {
            chapter.id = this.databaseService.transformId(chapter.id);
            for (let entry of chapter.entries) {
                entry.id = this.databaseService.transformId(entry.id);
            }
        }
        return super.normalize(typeClass, hash);
    }
}