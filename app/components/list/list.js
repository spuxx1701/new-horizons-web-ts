//----------------------------------------------------------------------------//
// Leopold Hock / 2021-06-04
// Description:
// Parent class for all lists.
//----------------------------------------------------------------------------//
import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';

export default class ListComponent extends Component {
    @service manager;

    @tracked rows = [];
    @tracked sortingKey;
    @tracked ascending = true;

    willRender() {
        // Sort initially if sortingKey is provided
        if (this.sortingKey) {
            if (this.ascending) {
                set(this, "rows", this.manager.sortArray(this.rows, this.sortingKey));
            } else {
                set(this, "rows", this.manager.sortArray(this.rows, "-" + this.sortingKey));
            }
        }
    }

    @action sortByProperty(property) {
        if (property == this.sortingKey) {
            // If the table is currently sorted by that key, just switch sorting direction
            this.ascending = !this.ascending;
        } else {
            // Else, sort ascending by the new sorting key
            this.sortingKey = property;
            this.ascending = true;
        }
        // Call rerender
        this.rerender();
    }
}