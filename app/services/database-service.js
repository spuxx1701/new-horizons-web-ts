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

    //@tracked data;

    init() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Initializer method.
        //----------------------------------------------------------------------------//
        super.init();
    }

    async loadCollection(collectionName) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-04-05
        // Description:
        // Loads a collectioon.
        //----------------------------------------------------------------------------//
        let transformedCollectionName = this.transformId(collectionName);
        let result = await this.store.findAll("database/" + transformedCollectionName);
        console.log("Loaded collection " + collectionName);
        return result;
    }

    getCollection(collectionName) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-03-08
        // Description:
        // Finds a collection in the database.
        //----------------------------------------------------------------------------//
        let transformedCollectionName = this.transformId(collectionName);
        let result = this.store.peekAll("database/" + transformedCollectionName);
        return result;
    }

    getIdentifiable(id) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Finds any identifiable in the database.
        //----------------------------------------------------------------------------//
        // process id to extract model name
        // make dasherized and separated by slash
        let transformedId = this.transformId(id);
        let splitTransformedId = transformedId.split('/');
        if (splitTransformedId.length > 1) {
            let collectionId = splitTransformedId[0];
            let result;
            if (result = this.store.peekRecord("database/" + collectionId, transformedId)) {
                return result;
            }
            this.manager.log(`Unable to find object with ID '${transformedId}' in collection '${collectionId}'.`, this.manager.msgType.x)
            return undefined;
        } else {
            this.manager.log(`ID '${transformedId}' has an invalid format and cannot be retrieved from any collection.`, this.manager.msgType.x);
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
        let object;
        if (object = this.getIdentifiable(pathSplit[1])) {
            // use the property name if specified or 'value' by defualt
            let propertyName = pathSplit[2];
            if (!propertyName) propertyName = "value";
            let result = object[propertyName];
            if (result) return result;
        }
        return undefined;
    }

    transformId(id) {
        // Transforms an id by repalcing underscores by slashes and dasherizes it
        let result = id.charAt(0).toLowerCase() + id.slice(1);
        result = Ember.String.dasherize(result.replaceAll("_", "/"));
        return result;
    }
}