// Leopold Hock | 30.04.2020
// Description: The LocalizationService manages the current localization and supplies localized values for keys.

import Ember from 'ember';
import Service from '@ember/service';
import config from '../config/environment';
import fetch from 'fetch';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that;

export default class LocalizationService extends Service {
    @service manager;
    @tracked supportedLanguages = ["en", "de"];
    @tracked currentLocalization = "de";
    @tracked localizationData;

    init() {
        super.init();
        that = this;
    }

    getValue(key) {
        if (!that.localizationData) return "";
        var result = that.localizationData.find(element => element.key.toLowerCase() === key.toLowerCase());
        if (result) {
            return result.value;
        } else {
            that.manager.log("warning", "Missing value for key '" + key + "' in localization '" + that.currentLocalization + "'.");
            return ("Loc_Error_" + key);
        }
    }

    async readLocalizationFile(language) {
        if (!language) {
            language = that.getUserLanguage()
        }
        var url = "/assets/localization/localization_" + language.toLowerCase() + ".json";
        var json = await fetch(url).then(function (response) {
            return response.json();
        }).catch(function (e) {
            that.manager.log("error", "Unable to retrieve localization file for language '" + language + "'.");
        });
        if (json) {
            that.currentLocalization = language;
            that.localizationData = json;
            that.manager.log("success", "Localization data for language '" + language + "' loaded sucessfully.");
        } else {
            that.manager.log("error", "Unable to retrieve localization file for language '" + language + "'.");
        }
    }

    getUserLanguage() {
        var userLanguage = navigator.language || navigator.userLanguage;
        if (userLanguage) {
            return userLanguage;
        }
        else {
            that.manager.log("warning", "Unable to read user language. Defaulting to English.");
            return userLanguage;
        }
    }
}