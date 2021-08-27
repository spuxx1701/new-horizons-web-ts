//----------------------------------------------------------------------------//
// Leopold Hock / 2021-08-14
// Description:
// This is the instance representation of a secondary attribute. For the model,
// see models/identifiables/sec-a.js
//----------------------------------------------------------------------------//
import Identifiable from "./identifiable";
import { set } from '@ember/object';
import { inject as service } from '@ember/service';

export default class SecondaryAttribute extends Identifiable {
    @service manager;
    @service database;
    @service generator;

    setProperty(property, value, { logSuccess = true, override = false } = {}) {
        if (this[property] === undefined) {
            this.manager.log(`Unable to change '${property}' of secondary attribute '${this.id}' for character '${this.character.getName()}': Property not found.`, "x");
            return undefined;
        }
        let oldValue = this[property];
        if (override) {
            set(this, property, value);
        } else {
            set(this, property, this[property] + value);
        }
        if (logSuccess) this.manager.log(`'${property}' of secondary attribute '${this.id}' for character '${this.character.getName()}' has been changed from ${oldValue} to ${this[property]}.`, "i");
        return this;
    }

    update({ logSuccess = true } = {}) {
        let sum = 0;
        for (let priAId of this.primaryAttributes) {
            let priA = this.getCharacter().getPrimaryAttribute(priAId);
            if (!priA) {
                this.manager.log(`Unable to update secondary attribute '${this.id}' for character '${this.character.getName()}': Primary Attribute '${priAId}' not found.`, "x");
                return undefined;
            }
            sum += priA.current;
        }
        let newValue = Math.round((sum / this.div) * 10 / 10);
        if (newValue !== this.current) {
            this.setProperty("current", newValue, { logSuccess: logSuccess, override: true });
        }
        return this;
    }
}