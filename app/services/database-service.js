//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-22
// Description:
// The DatabaseService manages the database and ruleset.
//----------------------------------------------------------------------------//
import Ember from 'ember';
import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { Changeset } from 'ember-changeset';

export default class DatabaseService extends Service {
    @service manager;
    @service store;

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
        let result = this.store.peekAll("database/" + transformedCollectionName);
        if (result.content.length > 0) {
            return result;
        } else {
            result = await this.store.findAll("database/" + transformedCollectionName);
            return result;
        }
    }


    async loadCollectionAsList(collectionName, { sortByLocalizedLabel = false, skipValidate = true } = {}) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-06-03
        // Description:
        // Loads a collection and returns the content in a format that can be directly
        // consumed by a UI list.
        //----------------------------------------------------------------------------//
        let collection = await this.loadCollection(collectionName);
        if (!collection) return undefined;
        let result = [];
        let that = this;
        collection.forEach(function (record) {
            let data = that.cloneRecord(record);
            let convertedRecord = {
                data: data,
                changeset: new Changeset(data, { skipValidate: skipValidate }),
                localizedLabel: that.manager.localize(record.id)
            }
            result.push(convertedRecord);
        });
        if (sortByLocalizedLabel) {
            this.manager.sortArray(result, "localizedLabel");
        }
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

    getIdentifiable(id, { clone = false, serialize = false } = {}) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Finds any identifiable in the database.
        //----------------------------------------------------------------------------//
        let transformedId = this.transformId(id);
        let splitTransformedId = transformedId.split('/');
        if (splitTransformedId.length > 1) {
            let collectionId = splitTransformedId[0];
            let result;
            if (result = this.store.peekRecord("database/" + collectionId, transformedId)) {
                if (clone) {
                    return this.cloneRecord(result);
                } else if (serialize) {
                    return result.serialize();
                } else {
                    return result;
                }
            }
            this.manager.log(`Unable to find object with ID '${transformedId}' in collection '${collectionId}'.`, this.manager.msgType.e)
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
        // Transforms an id by replacing underscores by slashes and dasherizes it
        let result = id.replaceAll("_", "/");
        let split = result.split("/");
        for (let i = 0; i < split.length; i++) {
            let part = split[i];
            part = part.charAt(0).toLowerCase() + part.slice(1);
            let regex = /[A-Z]+(?![a-z,\d])|[A-Z]?[a-z,\d]+|\d\+/g;
            if (part.match(regex)) {
                part = part.match(regex).join('-');
            }
            part = part.toLowerCase();
            split[i] = part;
        }
        result = split.join("/");
        return result;
    }

    cloneRecord(record) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-04-06
        // Description:
        // Clones a database record by extracting the data from the model record
        // and returning a copy of it.
        //----------------------------------------------------------------------------//
        if (typeof record.getRecord === "function") record = record.getRecord();
        return this.manager.clone(record.serialize(), record.id)
    }
}