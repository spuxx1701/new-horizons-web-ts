//  Leopold Hock | 18.06.2020
//  Description: Controller for component 'Interactable::Inputfield'.
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { observer } from '@ember/object';

export default class InputfieldComponent extends InteractableComponent {
    @service manager;
    @tracked labelPosition = "top";
    @tracked textPosition = "left";
    @tracked value;
    @tracked valueSuffix; // Shown before the value when inputfield is not currently being focused
    @tracked valueCombined; // Shown after the value when inputfield is not currently being focused
    @tracked pattern;
    @tracked invalid = false;
    @tracked hideInvalidity = true;

    init() {
        super.init()
        // if 'required' is true, but no pattern specified, default to 'any' pattern
        if (this.required && !this.pattern) {
            this.set("pattern", this.manager.pattern.any);
        }
        this.addObserver("invalid", this, "invalidDidChange");
    }

    @action didRender() {
        // add event listeners
        if (this.eventListeners) {
            for (let listener of this.eventListeners) {
                document.getElementById(this.id + "-input").addEventListener(listener.event, listener.function);
            }
        }
    }

    @action onChange(event) {
        this.changeset.set(this.key, event.srcElement.value);
        if (this.onChangeListener) {
            this.onChangeListener(event, { key: this.get("key"), changeset: this.get("changeset") });
        }
    }

    @action onInvalid() {
        // expose invalidity to user
        this.set("hideInvalidity", false);
    }

    @action invalidDidChange() {
        console.log(this.invalid);
        this.set("hideInvalidity", !this.invalid);
    }
}