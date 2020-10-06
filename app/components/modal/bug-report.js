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
    @tracked data = { description: "", reproduction: "", email: "", includeLog: true };
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
            fetch(this.manager.config.APP.apiUrl + "bug-report" + this.manager.config.APP.apiSuffix, {
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
            this.manager.hideModal();
        }
        /*if (that.session.isAuthenticated) {
            that.session.store.persist(that.session.data);
            fetch(config.APP.APIURL + "user", {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: that.session.data.authenticated.user.name,
                    password: that.session.data.authenticated.user.pin,
                    accessToken: that.session.data.authenticated.access_token,
                    mode: "update",
                    user: that.session.data.authenticated.user
                })
            })
                .then(
                    function (response) {
                        if (response.error) {
                            that.manager.showMessageToast("Das hat leider nicht geklappt. Der Server hat folgende Meldung ausgespuckt: "
                                + response.error + " - " + response.error_description);
                        }
                        else {
                            response.json().then(function (response) {
                                if (showSuccessMessage) {
                                    that.showMessageToast("Benutzereinstellungen gespeichert.");
                                }
                                that.readUser();
                            });
                        }
                    }
                )
                .catch(function (err) {
                    console.error('Fetch Error :-S', err);
                });
        }*/
    }
}