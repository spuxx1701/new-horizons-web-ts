//----------------------------------------------------------------------------//
// Leopold Hock / 2021-06-04
// Description:
// Traits list. Expects a 'traits' array in the 'list' format.
//----------------------------------------------------------------------------//
import ListComponent from './list';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';

export default class ListTraitsComponent extends ListComponent {
    @tracked isGenerator = false;
    @tracked isOwned = false;

    @action onAddClick(event) {

    }

    @action onRemoveClick(event) {

    }
}