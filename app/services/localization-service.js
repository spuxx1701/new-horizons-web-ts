// Leopold Hock | 30.04.2020
// Description: The LocalizationService manages the current localization and supplies localized values for keys.
// Changes:
// Leopold Hock | 17.06.2020 | Implemented ember-data. Localization now stored in localization model.

import Ember from 'ember';
import Service from '@ember/service';
import config from '../config/environment';
import fetch from 'fetch';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that;

export default class LocalizationService extends Service {
    @service manager;
    @service store;
    @tracked supportedLanguages = ["en", "de"];
    @tracked currentLocalization = "de";
    //@tracked localizationData;

    init() {
        super.init();
        that = this;
        //this.currentLocalization = this.getUserLanguage();
    }

    getValue(key) {
        /*if (!this.currentLocalization) {
            this.currentLocalization = this.getUserLanguage();
        }*/
        key = key.replace("_", "/");
        key = Ember.String.dasherize(key);
        if (that.store.peekAll("localization").length == 0) return "";
        let result = that.store.peekRecord("localization", key);
        if (result) {
            return result.value;
        } else {
            that.manager.log("warning", "Missing value for key '" + key + "' in localization '" + that.currentLocalization + "'.");
            return ("loc_miss::" + key);
        }
    }

    getUserLanguage() {
        let userLanguage = navigator.language || navigator.userLanguage;
        if (userLanguage) {
            return userLanguage;
        }
        else {
            that.manager.log("warning", "Unable to read user language. Defaulting to English.");
            return 'en';
        }
    }
}