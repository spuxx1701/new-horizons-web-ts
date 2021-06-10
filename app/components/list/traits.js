//----------------------------------------------------------------------------//
// Leopold Hock / 2021-06-04
// Description:
// Traits list. Expects a 'traits' array in the 'list' format.
//----------------------------------------------------------------------------//
import ListComponent from './list';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';

export default class ListTraitsComponent extends ListComponent {
    @service manager;
    @service databaseService;
    @service generator;

    @tracked isGenerator = false;
    @tracked isOwned = false;

    @action onAddClick(trait, event) {
        if (trait.data.needsInput) {
            // If trait needs input,  check for valid input
            if (this.manager.isNullOrWhitespace(trait.data.input)) {
                set(trait, "invalid", true);
                return;
            }
            // If trait needs input, check whether the character has the same trait with the same input
            if (this.generator.getCharacter().getTrait(trait.data.id, { input: trait.changeset.input })) {
                this.manager.callModal("confirm", [{ name: "title", value: "Modal_CannotAddTrait_Title" }, { name: "text", value: "Modal_CannotAddTrait_CharacterOwnsTrait" }]);
                return;
            }
        } else if (trait.data.hasOptions) {
            // If trait needs input, check whether the character has the same trait with the same input
            if (this.generator.getCharacter().getTrait(trait.data.id, { input: trait.changeset.input })) {
                this.manager.callModal("confirm", [{ name: "title", value: "Modal_CannotAddTrait_Title" }, { name: "text", value: "Modal_CannotAddTrait_CharacterOwnsTrait" }]);
                return;
            }
        } else {
            // Else, just check whether the character already has that trait
            if (this.generator.getCharacter().getTrait(trait.data.id)) {
                this.managerr.callModal("confirm", [{ name: "title", value: "Modal_CannotAddTrait_Title" }, { name: "text", value: "Modal_CannotAddTrait_CharacterOwnsTrait" }]);
                return;
            }
        }
    }

    @action onRemoveClick(trait, event) {

    }

    @action onOptionChange(selectedItem, dropdown) {
        // Update the currently selected option
        let changeset = dropdown.context.changeset;
        changeset.set("selectedOption", selectedItem);
        // Check whether that option changes the cost
        if (selectedItem.changesCost) {
            if (this.manager.tryParseInt(selectedItem.value) !== false) {
                // If it's a numeric value, set it accordingly
                changeset.set("costs", this.manager.tryParseInt(selectedItem.value));
            } else {
                // if it's not, parse it as a mathematical function and get the result
                let newCost = this.manager.database.parseMathFunction(selectedItem.value);
                changeset.set("costs", newCost);
                changeset.save();
            }
        }
    }
}