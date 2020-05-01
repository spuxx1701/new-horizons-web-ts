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

    async getValue(key) {
        if (!that.localizationData) {
            await that.getUserLanguage();
        }
        var value = that.localizationData.items.forEach(function (item, index) {
            if (item.key.toLowerCase() === key.toLowerCase()) {
                return item.value;
            }
        });
        if (value) {
            return value;
        } else {
            return ("LOC_ERROR_" + key);
        }
    }

    async getUserLanguage() {
        var userLanguage = navigator.language || navigator.userLanguage;
        if (userLanguage) {
            await that.readLocalizationFile(userLanguage);
        }
        else {
            that.manager.log("warning", "Unable to read user language. Defaulting to English.");
            await this.readLocalizationFile("en");
        }
    }

    async readLocalizationFile(language) {
        var url = "/assets/localization/localization_" + language.toLowerCase() + ".json";
        var response = await fetch(url).then(function (response) {
            return response;
        }).then(function (data) {
            console.log(data);
        }).catch(function (e) {
            that.manager.log("error", "Unable to retrieve localization file for language " + language + ".");
        });
        /*if (json) {
            that.currentLocalization = language;
            that.localizationData = json;
            that.manager.log("success", "Localization data for langauge " + language + " loaded sucessfully.");
        }*/
    }
}