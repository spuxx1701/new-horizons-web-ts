//----------------------------------------------------------------------------//
// Leopold Hock / 2021-01-20
// Description:
// Controller for route Sign-Up. This is where users sign up new accounts.
//----------------------------------------------------------------------------//

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';
import fetch from 'fetch';

export default class SignUpController extends Controller {
    @service manager;
    @tracked data = {};
    @tracked changeset = Changeset(this.data);
    @tracked passwordEventListeners = [{ event: "input", function: this.onPasswordChange }, { event: "invalid", function: this.onPasswordInvalid }]
    @tracked submitIsBusy = false;

    @tracked title = "";

    init() {
        super.init();
    }

    @action onSubmit(event) {
        event.preventDefault();
        let sha256 = require('js-sha256');
        let form = event.srcElement;
        if (form.checkValidity()) {
            let user = {
                email: this.changeset.get("email"),
                username: this.changeset.get("username"),
                password: sha256(this.changeset.get("passwordRaw"))
            }
            this.signUp(user);
        }
    }

    @action signUp(user) {
        // send the sign-up request
        let that = this;
        this.submitIsBusy = true;
        fetch(this.manager.config.APP.apiUrl + this.manager.config.APP.apiNamespace + "sign-up", {
            method: 'POST',
            headers: { "Content-Type": "application/vnd.api+json" },
            body: JSON.stringify({ data: user })
        }).then(function (response) {
            that.submitIsBusy = false;
            // on success, notify the user and ask them to confirm their email
            let modalType = { "name": "type", "value": "success" };
            let modalTitle = { "name": "title", "value": "Modal_SignUpError_Title" };
            let modalText = { "name": "text", "value": ["Modal_SignUpError_Text01"] };
            let yesLabel = { "name": "yesLabel", "value": "Misc_Ok" };
            let yesListener = {
                "event": "click", "id": "modal-button-footer-yes", "function": function () {
                    that.manager.hideModal();
                }
            }
            this.manager.callModal("confirm", [modalType, modalTitle, modalText, yesLabel], [yesListener]);
        }).catch(function (error) {
            that.submitIsBusy = false;
            // if the request fails, ask the user to try again later
            let modalType = { "name": "type", "value": "error" };
            let modalTitle = { "name": "title", "value": "Misc_Sorry" };
            let modalText = { "name": "text", "value": ["Modal_SignUpError_Text01"] };
            let yesLabel = { "name": "yesLabel", "value": "Misc_Ok" };
            let yesListener = {
                "event": "click", "id": "modal-button-footer-yes", "function": function () {
                    that.manager.hideModal();
                }
            }
            that.manager.callModal("confirm", [modalType, modalTitle, modalText, yesLabel], [yesListener]);
        });
    }

    @action onPasswordChange(event) {
        let password = event.srcElement.value;
        let complexity = 0;
        let length = password.length;
        let variety = 0;
        if (password.match(/[a-zA-Z]/)) variety++; // does the password have letters?
        if (password.match(/\d/)) variety++; // does the password have digits?
        if (password.match(/[!@#$%&*()-+=^]/)) variety++; // does the password have special characters?
        if (length >= 26 && variety > 2) complexity = 4;
        else if (length <= 25 && length >= 19 && variety > 2) complexity = 3;
        else if ((length >= 13) && variety === 2) complexity = 2;
        else complexity = 1;
        switch (complexity) {
            case 0: // no or invalid password
                document.getElementById("password-sec-bar-1").style.backgroundColor = "var(--colorGreyMedium)";
                document.getElementById("password-sec-bar-2").style.backgroundColor = "var(--colorGreyMedium)";
                document.getElementById("password-sec-bar-3").style.backgroundColor = "var(--colorGreyMedium)";
                document.getElementById("password-sec-bar-4").style.backgroundColor = "var(--colorGreyMedium)";
                break;
            case 1: // 8-12 characters, contains only one of the character categories (letters, numbers, special characters)
                document.getElementById("password-sec-bar-1").style.backgroundColor = "var(--colorModalHeaderError)";
                document.getElementById("password-sec-bar-2").style.backgroundColor = "var(--colorGreyMedium)";
                document.getElementById("password-sec-bar-3").style.backgroundColor = "var(--colorGreyMedium)";
                document.getElementById("password-sec-bar-4").style.backgroundColor = "var(--colorGreyMedium)";
                break;
            case 2: // 13-18 characters, contains two of the character categories (letters, numbers, special characters)
                document.getElementById("password-sec-bar-1").style.backgroundColor = "var(--colorModalHeaderWarning)";
                document.getElementById("password-sec-bar-2").style.backgroundColor = "var(--colorModalHeaderWarning)";
                document.getElementById("password-sec-bar-3").style.backgroundColor = "var(--colorGreyMedium)";
                document.getElementById("password-sec-bar-4").style.backgroundColor = "var(--colorGreyMedium)";
                break;
            case 3: // 19-25 characters, contains all of the character categories (letters, numbers, special characters)
                document.getElementById("password-sec-bar-1").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                document.getElementById("password-sec-bar-2").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                document.getElementById("password-sec-bar-3").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                document.getElementById("password-sec-bar-4").style.backgroundColor = "var(--colorGreyMedium)";
                break;
            case 4: // 25-40 characters, contains all of the character categories (letters, numbers, special characters)
                document.getElementById("password-sec-bar-1").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                document.getElementById("password-sec-bar-2").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                document.getElementById("password-sec-bar-3").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                document.getElementById("password-sec-bar-4").style.backgroundColor = "var(--colorModalHeaderSuccess)";
                break;
        }
    }

    @action onPasswordInvalid(event) {
        document.getElementById("password-requirements-text").classList.remove("display-none");
    }
}