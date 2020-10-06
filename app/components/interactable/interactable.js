//----------------------------------------------------------------------------//
// Leopold Hock / 2020-09-24
// Description:
// Parent class for all interactable UI components.
//----------------------------------------------------------------------------//

import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class InteractableComponent extends Component {
    @service manager;
    @tracked focus = false;
    initialRender = true;

    init() {
        super.init();
    }

    @action willRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-24
        // Description:
        // Triggered before interactable component will render.
        //----------------------------------------------------------------------------//
    }

    @action didRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-24
        // Description:
        // Triggered after interactable component has been rendered.
        //----------------------------------------------------------------------------//
        if (!this.initialRender) return;
        this.initialRender = false;
        let component = document.getElementById(this.id);
        let interactables = component.getElementsByClassName("interactable");
        if (interactables.length < 1) return;
        if (this.focus) {
            interactables[0].focus();
        }
    }
}