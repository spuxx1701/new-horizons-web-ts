//  Leopold Hock | 18.06.2020
//  Description: Controller for component 'Interactable::Inputfield'.
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class InputfieldComponent extends InteractableComponent {
    @tracked value;
    @tracked valueSuffix; // Shown before the value when inputfield is not currently being focused
    @tracked valueCombined; // Shown after the value when inputfield is not currently being focused

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