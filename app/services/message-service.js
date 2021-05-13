//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-23
// Description:
// This service manages messaging and logging. This includes the app log
// that can be observed in production, console-logging (only active during development)
// as well as messageToasts that can be seen by the user.
//----------------------------------------------------------------------------//
import Ember from 'ember';
import Service from '@ember/service';
import Model from '@ember-data/model';
import ENV from 'new-horizons-web/config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ManagerService extends Service {
    @service manager;
    @service localizationService;
    @service modalService;
    @service store;

    @tracked msgType = {
        s: "s", // success
        i: "i", // information
        w: "w", // warning
        e: "e", // error
        x: "x"  // exception
    };

    @action init() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-23
        // Description:
        // Initializer method.
        //----------------------------------------------------------------------------//
        super.init();
        let that = this;
        window.onerror = function (message, source, lineno, colno, error) {
            that.logMessage(message + " (at: '" + source + "', line: " + lineno + ", column: " + colno + ")", "x");
        };
    }

    @action logMessage(messageText, messageType = this.msgType.i, showToUser = false) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-23
        // Description:
        // This method logs a message, decides where to do so and whether it should be
        // displayed to the user. Should not be called directly (use manager.log() instead).
        //----------------------------------------------------------------------------//
        this.store.createRecord("applog", { createdAt: this.getCurrentUTCTime(), type: messageType, text: messageText })
        if (ENV.environment === "development") {
            if (messageType === this.msgType.x || messageType === this.msgType.e) {
                console.error(messageText);
            } else if (messageType === this.msgType.w) {
                console.warn(messageText);
            } else {
                console.log(messageText);
            }
        }
        if (messageType === this.msgType.x) {
            this.askForExceptionReport(messageText);
        }
    }

    @action askForExceptionReport(messageText) {
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
        let modalTitle = { "name": "title", "value": "Misc_Sorry" };
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

    @action showApplog() {
        this.manager.callModal("applog");
    }

    @action getApplog(maxEntries = undefined, asJson = false) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-10-04
        // Description:
        // Returns the current log up to n entries and stringifies if required.
        //----------------------------------------------------------------------------//
        let result = [];
        let applog = this.store.peekAll("applog").content;
        for (let i = applog.length - 1; i >= 0; i--) {
            if (!applog[i] || (maxEntries && result.length >= maxEntries)) break;
            result.push(applog[i].getRecord().serialize());
        }
        if (asJson) result = JSON.stringify(result);
        return result;
    }

    @action getCurrentUTCTime() {
        let d = new Date();
        let year = String(d.getUTCFullYear());
        let month = (d.getUTCMonth() + 1);
        if (month < 10) month = "0" + String(month);
        else month = String(month);
        let date = d.getUTCDate();
        if (date < 10) date = "0" + String(date);
        else date = String(date);
        let hours = d.getUTCHours();
        if (hours < 10) hours = "0" + String(hours);
        else hours = String(hours);
        let minutes = d.getUTCMinutes();
        if (minutes < 10) minutes = "0" + String(minutes);
        else minutes = String(minutes);
        let seconds = d.getUTCSeconds();
        if (seconds < 10) seconds = "0" + String(seconds);
        else seconds = String(seconds);
        let result = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        return result;
    }
}