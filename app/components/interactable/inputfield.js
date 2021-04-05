//  Leopold Hock | 18.06.2020
//  Description: Controller for component 'Interactable::Inputfield'.
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class InputfieldComponent extends InteractableComponent {
    @tracked labelPosition = "top";
    @tracked textPosition = "left";
    @tracked value;
    @tracked valueSuffix; // Shown before the value when inputfield is not currently being focused
    @tracked valueCombined; // Shown after the value when inputfield is not currently being focused

    @action didRender(event) {
        // add event listeners
        if (this.eventListeners) {
            for (let listener of this.eventListeners) {
                document.getElementById(this.id + "-input").addEventListener(listener.event, listener.function);
            }
        }
        // override
    }

    @action onChange(event) {
        this.changeset.set(this.key, event.srcElement.value);
        if (this.onChangeListener) {
            this.onChangeListener(event);
        }
    }

    @action onInvalid(event) {
        // expose invalidity to user
        event.srcElement.classList.remove("inputfield-hide-invalidity");
    }
}