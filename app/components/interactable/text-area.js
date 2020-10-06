//  Leopold Hock | 18.06.2020
//  Description: Controller for component 'Interactable::Inputfield'.
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TextAreaComponent extends InteractableComponent {
    @tracked height = "small";

    @action onChange(event) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-10-04
        // Description:
        // Is being triggered when the value is being changed. Invokes an update on the
        // original changeset.
        //----------------------------------------------------------------------------//
        this.changeset.set(this.key, event.srcElement.value);
    }
}