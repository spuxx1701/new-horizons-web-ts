//----------------------------------------------------------------------------//
// Leopold Hock / 2020-10-04
// Description:
// Controller for component 'Interactable::Toggle'
//----------------------------------------------------------------------------//
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ToggleComponent extends InteractableComponent {
    @service manager;

    @action onChange(event) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-10-04
        // Description:
        // Is being triggered when the value is being changed. Invokes an update on the
        // original changeset.
        //----------------------------------------------------------------------------//
        this.changeset.set(this.key, event.srcElement.checked);
    }
}