import ListElementComponent from './element';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';

export default class ListElementTraitComponent extends ListElementComponent {
    @tracked changeset = new Changeset({ input: "", level: 0 });

    @action onAddClick(event) {

    }

    @action onRemoveClick(event) {

    }
}