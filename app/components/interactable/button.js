//----------------------------------------------------------------------------//
// Leopold Hock / 2021-01-21
// Description:
// Controller for component interactable::button.
//----------------------------------------------------------------------------//
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { computed, set } from '@ember/object';

export default class DropdownComponent extends InteractableComponent {
    @service manager;
    @tracked disabled = false;
    @tracked busy = false;

    init() {
        super.init()
    }

    get isDisabled() {
        return (this.get("disabled") || this.get("busy"));
    }
}