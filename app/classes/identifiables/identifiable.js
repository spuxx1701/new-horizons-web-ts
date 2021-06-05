import Ember from 'ember';
import { tracked } from '@glimmer/tracking';
import { set } from '@ember/object'

export default class Identifiable {
    databaseService;

    @tracked id;
    @tracked data;

    constructor(manager, id, { data = undefined } = {}) {
        if (!manager || !id) {
            throw "Not all required constructor parameters were supplied during instantiation of identifiable.";
        }
        this.databaseService = manager.databaseService;
        set(this, "id", id);
        if (data) {
            set(this, "data", data);
        } else {
            set(this, "data", this.databaseService.getIdentifiable(id, { clone: true }));
            if (!this.data) {
                return undefined;
            }
        }
    }
}