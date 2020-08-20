import Ember from 'ember';
import JSONSerializer from '@ember-data/serializer/json';

export default class StellarpediaSerializer extends JSONSerializer {
    // make IDs lower case and dasherize
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash).replace("_", "/");
        id = Ember.String.dasherize(id);
        return id;
    }

    // also make IDs in chapters and entries lower case and dasherize
    normalize(typeClass, hash) {
        for (let chapter of hash.chapters) {
            chapter.id = Ember.String.dasherize(chapter.id.replace("_", "/"));
            for (let entry of chapter.entries) {
                entry.id = Ember.String.dasherize(entry.id.replace("_", "/"));
            }
        }
        return super.normalize(typeClass, hash);
    }
}