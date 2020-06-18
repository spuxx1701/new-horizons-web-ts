// Leopold Hock | 18.06.2020
// Description: Parent class for all interactable UI components.

import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class InteractableComponent extends Component {
    @service manager;
    @tracked forceDisable = false;
    @tracked disabled = false;

    init() {
        super.init();
    }

    willRender() {
        this.set("disabled", this.get("forceDisable"));
    }
}