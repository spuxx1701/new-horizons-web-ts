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
                this.manager.log(`Unable to find object with ID '${id}' in database model '${modelName}'.`, this.manager.msgType.x)
                return undefined;
            }
        } else {
            this.manager.log(`ID '${id}' has an invalid format and cannot be retrieved from any database model.`, this.manager.msgType.x);
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
        let pathSplit = path.split(";");
        let databaseId = this.manager.prepareId(pathSplit[0]);
        let database = this.store.peekRecord("database", databaseId);
        // try to find correct database array
        if (database) {
            let entryId = this.manager.prepareId(pathSplit[1]);
            // try to find entry
            for (let entry of database.entries) {
                if (entry.id === entryId) {
                    // if this is a constant, return value
                    if (entryId.startsWith("constant")) {
                        return entry.value;
                    }
                    // else, try to find property
                    else {
                        if (entry.hasOwnProperty(pathSplit[2])) {
                            return entry[pathSplit[2]];
                        }
                    }
                }
            }
        }
        // throw error
        this.manager.log("Unable to find data by path: " + path, this.manager.msgType.x);
        return undefined;
    }

    getDataFromId(id) {

    }
}
