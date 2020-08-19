// Leopold Hock | 23.05.2020
// Description: The DatabaseService manages the database and ruleset.
import Ember from 'ember';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that;

export default class DatabaseService extends Service {
    @service manager;
    @service store;

    init() {
        super.init();
        that = this;
    }

    // finds any identifiable in any database model
    getIdentifiable(id) {
        // process id to extract model name
        // decamelize for extracting the model name
        let dasherizedId = Ember.String.dasherize(id);
        let splitDasherizedId = dasherizedId.split('/');
        if (splitDasherizedId.length > 1) {
            let modelName = that.manager.constants.databaseModelPrefix + splitDasherizedId[0];
            if (that.store.peekAll(modelName).length == 0) return undefined;
            let result = that.store.peekRecord(modelName, id);
            if (result) {
                return result;
            } else {
                that.manager.log("error", `Unable to find object with ID '${id}' in database model '${modelName}'.`)
                return undefined;
            }
        } else {
            that.manager.log("error", `ID '${id}' has an invalid format, thus cannot be retrieved from any database model.`);
            return undefined;
        }
    }
}
