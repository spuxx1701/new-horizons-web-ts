import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';

export default class ListContainerComponent extends Component {
    @tracked tableSize = "xl"
}