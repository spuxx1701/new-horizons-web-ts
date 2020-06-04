//  Leopold Hock | 30.04.2020
//  Description: This service logs and messages any kind of messages.

import Ember from 'ember';
import Service from '@ember/service';
import config from '../config/environment';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that;

export default class ManagerService extends Service {
    @tracked sessionLog = [];
    @service localizationService;

    init() {
        super.init();
        that = this;
    }

    logMessage(messageText, messageType = "info", showToUser = false) {
        var message = {
            timestamp: new Date().getTime(),
            type: messageType,
            text: messageText
        }
        that.sessionLog.push(message);
        if (config.APP.environment !== "production") {
            if (messageType === "error") {
                console.error(messageText);
            } else if (messageType === "warning") {
                console.warn(messageText);
            } else {
                console.log(messageText);
            }
        }
        /*
        if (messageType === "error") {

        } else if (messageType === "warning") {

        } else if (messageType === "success") {

        } else {

        }*/
    }
}