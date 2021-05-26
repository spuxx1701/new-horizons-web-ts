//----------------------------------------------------------------------------//
// Leopold Hock / 2021-05-24
// Description:
// Parent class for all list element components.
//----------------------------------------------------------------------------//
import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { computed, set } from '@ember/object';

export default class InteractableComponent extends Component {
    @service manager;
    @service databaseService;
    @service("generator-service") generator;
}