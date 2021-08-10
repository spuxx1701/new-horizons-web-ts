//----------------------------------------------------------------------------//
// Leopold Hock / 2021-06-04
// Description:
// Parent class for all lists.
//----------------------------------------------------------------------------//
import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { computed, set } from '@ember/object';
import { Changeset } from 'ember-changeset';

export default class ListComponent extends Component {
    @service manager;
    @service database;

    @tracked data = [];
    @tracked sortingKey;
    @tracked ascending = true;

    isInitialized = false;

    @computed("data", "ascending")
    get rows() {
        let result = [];
        if (Array.isArray(this.data)) {
            for (let element of this.data) {
                let row = {
                    data: element,
                    changeset: new Changeset(element, { skipValidate: true }),
                    localizedLabel: this.manager.localize(element.id)
                }
                result.push(row);
            }
        } else if (this.data?.content) {
            let records = this.data.toArray();
            for (let record of records) {
                let row = {
                    data: record,
                    changeset: new Changeset(record, { skipValidate: true }),
                    localizedLabel: this.manager.localize(record.id)
                }
                result.push(row);
            }
        }
        if (this.sortingKey) {
            if (this.ascending) {
                result = this.manager.sortArray(result, this.sortingKey);
            } else {
                result = this.manager.sortArray(result, "-" + this.sortingKey);
            }
        }
        return result;
    }

    @action sortByProperty(property) {
        if (property == this.sortingKey) {
            // If the table is currently sorted by that key, just switch sorting direction
            this.set("ascending", !this.ascending);
        } else {
            // Else, sort ascending by the new sorting key
            this.set("sortingKey", property);
            this.set("ascending", true);
        }
    }
}