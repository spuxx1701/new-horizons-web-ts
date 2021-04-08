//----------------------------------------------------------------------------//
// Leopold Hock / 2020-09-22
// Description:
// Modal::Confirm component.
//----------------------------------------------------------------------------//
import ModalComponent from './modal';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { Changeset } from 'ember-changeset';
import { inject as service } from '@ember/service';

export default class ModalSingleInputComponent extends ModalComponent {
    @service manager;

    @tracked type = "default"; // "warning", "error", "success"
    @tracked title = ""; // any string 
    @tracked text = []; // any array of strings (localization may fail)
    @tracked inputLabel = "";
    @tracked inputRequired = true;
    @tracked inputPlaceholder = "";
    @tracked inputType = "text";
    @tracked inputPattern = "";
    @tracked inputSubtitle = "";
    @tracked data = {};
    @tracked changeset = Changeset(this.data);
    @tracked icon = undefined; // any string, unused if undefined
    @tracked yesLabel = "Misc_Ok"; // any string
    @tracked noLabel = undefined; // any string, no-button hidden if undefined
    @tracked isClosable = true; // boolean, whether close button is available

    willRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-22
        // Description:
        // Triggers before the modal is being rendered. Argument interpretation is
        // happening here. Calling super.willRender() is required.
        //----------------------------------------------------------------------------//
        super.willRender();
        // set icon to match header type if it hasn't been set manually
        if (!this.icon) {
            switch (this.type) {
                case "warning":
                    this.icon = "exclamation-triangle";
                    break;
                case "error": {
                    this.icon = "exclamation-circle";
                    break;
                }
                case "success": {
                    this.icon = "check-circle";
                    break;
                }
                default: {
                    this.icon = "info-circle";
                }
            }
        }
    }

    didRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-22
        // Description:
        // Triggers after the modal has rendered. Event subscription is happening here.
        // Calling super.didRender() is required.
        //----------------------------------------------------------------------------//
        super.didRender();
    }

    @action onSubmit(event) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-22
        // Description:
        // Triggers when the form is submitted. Can be overwritten.
        //----------------------------------------------------------------------------//
        event.preventDefault();
        this.manager.hideModal();
    }

    @action onNoClick() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-22
        // Description:
        // Triggers when no-button is clicked. Can be overwritten.
        //----------------------------------------------------------------------------//
        this.manager.hideModal();
    }

    // @action validate() {
    //     let input = this.inputChangeset.get("input");
    // }
}