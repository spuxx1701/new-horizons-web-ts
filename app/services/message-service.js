//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-23
// Description:
// This service manages messaging and logging. This includes the session log
// that can be observed in production, console-logging (only active during development)
// as well as messageToasts that can be seen by the user.
//----------------------------------------------------------------------------//
import Ember from 'ember';
import Service from '@ember/service';
import config from '../config/environment';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ManagerService extends Service {
    @service manager;
    @service localizationService;
    @service modalService;

    @tracked sessionLog = [];
    @tracked latestError = {};
    @tracked msgType = {
        s: "s", // success
        i: "i", // information
        w: "w", // warning
        e: "e", // error
        x: "x",  // exception
        xw: "xw", // possibly non-critical exception
        xi: "xi" // non-critical exception
    };

    init() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-23
        // Description:
        // Initializer method.
        //----------------------------------------------------------------------------//
        super.init();
        let that = this;
        window.onerror = function (message, source, lineno, colno, error) {
            that.logMessage(message + " (at: '" + source + "', line: " + lineno + ", column: " + colno + ")", "x");
            that.latestError = error;
        };
    }

    logMessage(messageText, messageType = this.manager.msgType.i, showToUser = false) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-23
        // Description:
        // This method logs a message, decides where to do so and whether it should be
        // displayed to the user. Should not be called directly (use manager.log() instead).
        //----------------------------------------------------------------------------//
        var message = {
            timestamp: new Date().getTime(),
            type: messageType,
            text: messageText
        }
        this.sessionLog.push(message);
        if (config.environment === "development") {
            if (messageType === this.msgType.x || messageType === this.msgType.xw || messageType === this.msgType.xi) {
                console.error(messageText);
            } else if (messageType === this.msgType.w || messageType === this.msgType.e) {
                console.warn(messageText);
            } else {
                console.log(messageText);
            }
        }
        if (messageType === this.msgType.x) {
            this.askForExceptionReport(messageText);
        }
    }

    askForExceptionReport(messageText) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-23
        // Description:
        // This method calls a modal that asks the user to report an exception that
        // has been raised. It is triggered when (1) logMessage() has been called
        // with msgType.x and (2) whenever the browser throws an uncaught exception
        // (onerror event).
        //----------------------------------------------------------------------------//
        let that = this;
        let modalType = { "name": "type", "value": "error" };
        let modalTitle = { "name": "title", "value": "Modal_ReportException_Title" };
        let modalText = { "name": "text", "value": ["Modal_ReportException_Text01", "\"" + messageText + "\"", "Modal_ReportException_Text02"] };
        let yesLabel = { "name": "yesLabel", "value": "Misc_Yes" };
        let noLabel = { "name": "noLabel", "value": "Misc_No" };
        let yesListener = {
            "event": "click", "id": "modal-button-footer-yes", "function": function () {
                that.modalService.render("bug-report", [{ "name": "data.description", "value": messageText }]);
            }
        }
        let noListener = {
            "event": "click", "id": "modal-button-footer-no", "function": function () {
                that.modalService.hide();
            }
        }
        this.manager.callModal("confirm", [modalType, modalTitle, modalText, yesLabel, noLabel], [yesListener, noListener]);
    }

    getSessionLog(maxEntries = undefined, asJson = false) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-10-04
        // Description:
        // Returns the current log up to n entries and stringifies if required.
        //----------------------------------------------------------------------------//
        let result = [];
        for (let i = this.sessionLog.length - 1; i >= 0; i--) {
            if (!this.sessionLog[i] || (maxEntries && result.length >= maxEntries)) break;
            result.push(this.sessionLog[i]);
        }
        if (asJson) result = JSON.stringify(result);
        return result;
    }
}