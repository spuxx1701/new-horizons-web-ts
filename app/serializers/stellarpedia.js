import Ember from 'ember';
import JSONSerializer from '@ember-data/serializer/json';

export default class StellarpediaSerializer extends JSONSerializer {
    // dasherize book ids
    extractId(modelClass, resourceHash) {
        let id = super.extractId(modelClass, resourceHash);
        id = Ember.String.dasherize(id);
        return id;
    }

    // also dasherize chapter and entry ids
    normalize(typeClass, hash) {
        for (let chapter of hash.chapters) {
            chapter.id = Ember.String.dasherize(chapter.id);
            for (let entry of chapter.entries) {
                if (entry.id.startsWith("SecA")) {
                    console.log(entry.id);
                }
                entry.id = Ember.String.dasherize(entry.id);
                if (entry.id.startsWith("sec-a")) {
                    console.log(entry.id);
                }
            }
        }
        return super.normalize(typeClass, hash);
    }
}