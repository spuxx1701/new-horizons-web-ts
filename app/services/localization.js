// Leopold Hock | 30.04.2020
// Description: The localization manages the current localization and supplies localized values for keys.
// Changes:
// Leopold Hock | 17.06.2020 | Implemented ember-data. Localization now stored in localization model.

import Ember from 'ember';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that;

export default class LocalizationService extends Service {
    @service manager;
    @service store;
    @service database;

    @tracked supportedLanguages = ["en", "de"];
    @tracked currentLocalization = "de";

    init() {
        super.init();
        that = this;
    }

    getValue(key, allowUndefined = false) {
        if (key.string) key = key.string;
        key = this.database.transformId(key);;
        if (that.store.peekAll("localization").length == 0) return "";
        let result = that.store.peekRecord("localization", key);
        if (result) {
            return result.value;
        } else {
            if (allowUndefined) return undefined;
            else return ("loc-miss::" + key);
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