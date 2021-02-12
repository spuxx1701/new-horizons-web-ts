import Component from '@ember/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import ENV from 'new-horizons-web/config/environment';
import fetch from 'fetch';

export default class SignInComponent extends Component {
    @service manager;
    @service session;
    @tracked data = {};
    @tracked changeset = Changeset(this.data);
    @tracked submitIsBusy = false;

    @action onSubmit(event) {
        event.preventDefault();
        let form = event.srcElement;
        if (form.checkValidity()) {
            this.authenticate(this.changeset.get("email"), this.changeset.get("passwordRaw"));//sha256(this.changeset.get("passwordRaw"))
        }
    }

    @action async authenticate(email, password) {
        let that = this;
        this.submitIsBusy = true;
        let credentials = { "email": email, "password": password };
        try {
            await this.session.authenticate('authenticator:jwt', credentials);
        } catch (error) {
            let modalType = { "name": "type", "value": "error" };
            if (error.status === 401) {
                // if the request fails without receiving a response, ask the user to try again later
                let modalTitle = { "name": "title", "value": "Modal_WrongCredentials_Title" };
                let modalText = { "name": "text", "value": ["Modal_WrongCredentials_Text01"] };
                let yesLabel = { "name": "noLabel", "value": "Misc_OK" };
                let noLabel = { "name": "yesLabel", "value": "Modal_WrongCredentials_Text02" };
                let yesListener = {
                    "event": "click", "id": "modal-button-footer-yes", "function": function () {
                        that.manager.hideModal();
                    }
                };
                let noListener = {
                    "event": "click", "id": "modal-button-footer-no", "function": function () {
                        that.manager.hideModal();
                    }
                };
                this.manager.callModal("confirm", [modalType, modalTitle, modalText, yesLabel, noLabel], [yesListener, noListener]);
            } else {
                // if the request fails without receiving a response, ask the user to try again later
                let modalTitle = { "name": "title", "value": "Misc_Sorry" };
                let modalText = { "name": "text", "value": ["Modal_SignInError_Text01"] };
                let yesLabel = { "name": "yesLabel", "value": "Misc_Yes" };
                let yesListener = {
                    "event": "click", "id": "modal-button-footer-yes", "function": function () {
                        that.manager.hideModal();
                    }
                }
                this.manager.callModal("confirm", [modalType, modalTitle, modalText, yesLabel], [yesListener]);
            }
        }
        this.submitIsBusy = false;
        if (this.session.isAuthenticated) {
            this.manager.log("Signed in successfully with email '" + this.session.data.authenticated.email + "'.");
            this.manager.hideModal();
        }
    }
}