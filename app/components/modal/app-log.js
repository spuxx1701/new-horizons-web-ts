//----------------------------------------------------------------------------//
// Leopold Hock / 2020-09-22
// Description:
// Modal::Bug-Report component.
//----------------------------------------------------------------------------//
import ModalComponent from './modal';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';

export default class ModalAppLogComponent extends ModalComponent {
    @service manager;
    @service store;
    @tracked data = { error: "", description: "", reproduction: "", email: "", stack: "", includeLog: true };
    @tracked changeset = Changeset(this.data);

    willRender() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-22
        // Description:
        // Triggers before the modal is being rendered. Argument interpretation is
        // happening here. Calling super.willRender() is required.
        //----------------------------------------------------------------------------//
        super.willRender();
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
}