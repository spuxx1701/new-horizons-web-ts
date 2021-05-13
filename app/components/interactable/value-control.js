import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { computed, set } from '@ember/object';

export default class InputfieldComponent extends InteractableComponent {
    @service manager;
    @tracked labelPosition = "top";
    @tracked textPosition = "right";
    @tracked value;
    @tracked valueSuffix; // Shown before the value when inputfield is not currently being focused
    @tracked valueCombined; // Shown after the value when inputfield is not currently being focused
    @tracked size = "small";
    step = 1;
    @tracked changeset;
    @tracked min;
    @tracked max;
    @tracked showButtons = true;


    init() {
        super.init()
    }

    @computed("disabled", "changeset", "min")
    get isDecreaseDisabled() {
        return (this.get("disabled") || this.get("changeset").get(this.key) - this.get("step") < this.get("min"));
    }

    @computed("disabled", "changeset", "max")
    get isIncreaseDisabled() {
        return (this.get("disabled") || this.get("changeset").get(this.key) + this.get("step") > this.get("max"));
    }

    @action onDecreaseClick(event) {
        let oldValue = this.changeset.get(this.key);
        let newValue = oldValue - this.step;
        if (this.min && newValue < this.min) {
            return;
        }
        this.changeset.set(this.key, newValue);
        if (this.onChangeListener) {
            this.onChangeListener(event, { key: this.get("key"), changeset: this.get("changeset") });
        }
    }

    @action onIncreaseClick(event) {
        let oldValue = this.changeset.get(this.key);
        let newValue = oldValue + this.step;
        if (this.max && newValue > this.max) {
            return;
        }
        this.changeset.set(this.key, newValue);
        if (this.onChangeListener) {
            this.onChangeListener(event, { key: this.get("key"), changeset: this.get("changeset") });
        }
    }
}