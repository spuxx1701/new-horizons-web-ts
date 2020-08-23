//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-22
// Description:
// The DatabaseService manages the database and ruleset.
//----------------------------------------------------------------------------//
import Ember from 'ember';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class DatabaseService extends Service {
    @service manager;
    @service store;

    @tracked data;

    init() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Initializer method.
        //----------------------------------------------------------------------------//
        super.init();
        this.load();
    }

    async load() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Loads and returns the database.
        //----------------------------------------------------------------------------//
        if (this.data) {
            return this.data;
        } else {
            let result = await this.store.findAll("database");
            this.data = result;
            this.manager.log("Database initialized.");
            return result;
        }
    }

    getIdentifiable(id) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Finds any identifiable in the database.
        //----------------------------------------------------------------------------//
        // process id to extract model name
        // decamelize for extracting the model name
        let dasherizedId = Ember.String.dasherize(id);
        let splitDasherizedId = dasherizedId.split('/');
        if (splitDasherizedId.length > 1) {
            let modelName = this.manager.constants.databaseModelPrefix + splitDasherizedId[0];
            if (this.store.peekAll(modelName).length == 0) return undefined;
            let result = this.store.peekRecord(modelName, id);
            if (result) {
                return result;
            } else {
                this.manager.log("error", `Unable to find object with ID '${id}' in database model '${modelName}'.`)
                return undefined;
            }
        } else {
            this.manager.log("error", `ID '${id}' has an invalid format, thus cannot be retrieved from any database model.`);
            return undefined;
        }
    }

    getDataFromPath(path) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // This returns a data entry's property from a path like it is used in the
        // Stellarpedia.
        //----------------------------------------------------------------------------//
        let pathSplit = path.split("/");
        let result;
        let database = this.store.peekRecord("database", pathSplit[0]);
        if (database) {

        }
        // throw error
        return result;
    }
}
