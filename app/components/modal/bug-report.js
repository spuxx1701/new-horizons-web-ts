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

export default class ModalBugReportComponent extends ModalComponent {
    @service manager;
    @service store;
    @tracked data = { description: "", reproduction: "", email: "", stack: "", includeLog: true };
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
        // if session is authentiacted, prefill the mail adress
        // if (this.manager.session.authenticated) {
        //     this.data.email = session.authenticated.data.user.email;
        // }
    }

    @action onSubmit() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-10-04
        // Description:
        // Triggers when the form is submitted.
        //----------------------------------------------------------------------------//
        let form = document.getElementById("modal-form");
        if (form.reportValidity()) {
            this.changeset.save();
            let logAsJson = "";
            if (this.data.includeLog) logAsJson = this.manager.messageService.getSessionLog(100, true);
            let post = this.store.createRecord("bug-report", {
                description: this.data.description,
                reproduction: this.data.reproduction,
                email: this.data.email,
                stack: this.manager.messageService.latestError.stack,
                applog: logAsJson
            });
            post.save();
            /*fetch(this.manager.config.APP.apiUrl + "bug-report", {
                method: "POST",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    description: this.data.description,
                    reproduction: this.data.reproduction,
                    email: this.data.email,
                    applog: logAsJson
                })
            }).then(
                function (response) {
                    response.json().then(function (json) {
                        console.log(json);
                    });
                }).catch(function (exception) {
                    console.log(exception);
                });
            this.manager.hideModal();*/
        }
    }
}