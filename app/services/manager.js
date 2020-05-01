//  Leopold Hock | 30.04.2020
//  Description: This is the central service for the entire application. The manager supplies the magnitude of utility
//  functions that are not part of another independent service.

import Ember from 'ember';
import Service from '@ember/service';
import config from '../config/environment';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that;

export default class ManagerService extends Service {
    @service localizationService;
    @service messageService;

    init() {
        super.init();
        that = this;
    }

    log (messageType = "info", messageText,) {
        that.messageService.logMessage(messageText, messageType);
    }
}