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
    @service database;
    @service generator;

    @tracked isGenerator = false;
    @tracked isOwned = false;

    @action onAddClick(row, event) {
        // check restrictions
        let restrictionCheckResult = this.generator.getCharacter().violatesRestrictions(row.data.restrictions, { detailedResult: true });
        if (restrictionCheckResult.violated) {
            this.manager.callModal("game/restrictions-violated", [{ name: "identifiable", value: row.data },
            { name: "violatedRestrictions", value: restrictionCheckResult.violatedRestrictions }]);
            return;
        }

        // if the trait has options, any restrictions of the selected option also need to be checked
        if (row.data.hasOptions && row.data.selectedOption.restrictions?.length > 0) {
            let selectedOptionRestrictionCheckResult = this.generator.getCharacter().violatesRestrictions(row.data.selectedOption.restrictions, { detailedResult: true });
            if (selectedOptionRestrictionCheckResult.violated) {
                this.manager.callModal("game/restrictions-violated", [{ name: "identifiable", value: row.data },
                { name: "violatedRestrictions", value: selectedOptionRestrictionCheckResult.violatedRestrictions },
                { name: "selectedOption", value: row.data.selectedOption }]);
                return;
            }
        }

        // Check requirements
        let requirementCheckResult = this.generator.getCharacter().meetsRequirements(row.data.requirements, { detailedResult: true });
        if (!requirementCheckResult.requirementsMet) {
            this.manager.callModal("game/requirements-failed", [{ name: "identifiable", value: row.data },
            { name: "failedRequirements", value: requirementCheckResult.failedRequirements },
            { name: "selectedOption", value: row.data.selectedOption }]);
            return;
        }

        // Add the trait
        let addedTrait;
        if (row.data.needsInput) {
            // If trait needs input,  check for valid input and whether the character has the same trait with the same input
            if (this.manager.isNullOrWhitespace(row.changeset.input)) {
                set(row, "invalid", true);
            } else if (this.generator.getCharacter().getTrait(row.data.id, { input: row.changeset.input })) {
                this.manager.callModal("confirm", [{ name: "type", value: "error" }, { name: "title", value: "Modal_CharacterOwnsTrait_Title" }, { name: "text", value: ["Modal_CharacterOwnsTrait_Text"] }]);
            } else {
                addedTrait = row.data.addToCharacter(this.generator.getCharacter(), { input: row.changeset.input, isGenerator: this.isGenerator });
                row.changeset.rollback();
            }
        } else if (row.data.hasOptions) {
            // If trait has options, check whether the character has the same trait with the same option
            if (this.generator.getCharacter().getTrait(row.data.id, { selectedOptionId: row.data.selectedOption.id })) {
                this.manager.callModal("confirm", [{ name: "type", value: "error" }, { name: "title", value: "Modal_CharacterOwnsTrait_Title" }, { name: "text", value: ["Modal_CharacterOwnsTrait_Text"] }]);
            } else {
                addedTrait = row.data.addToCharacter(this.generator.getCharacter(), { selectedOption: row.data.selectedOption, isGenerator: this.isGenerator });
            }
        } else {
            // Else, just check whether the character already has that trait
            if (this.generator.getCharacter().getTrait(row.data.id)) {
                this.manager.callModal("confirm", [{ name: "type", value: "error" }, { name: "title", value: "Modal_CharacterOwnsTrait_Title" }, { name: "text", value: ["Modal_CharacterOwnsTrait_Text"] }]);
            } else {
                addedTrait = row.data.addToCharacter(this.generator.getCharacter(), { isGenerator: this.isGenerator });
            }
        }

        // If trait has been added successfully, apply changes and reduce generation point budget
        if (addedTrait) {
            this.generator.setGp(-(addedTrait.costs));
        }
    }

    @action onRemoveClick(row, event) {
        let traitRemoved = this.generator.getCharacter().getTrait(row.data.id, { input: row.data.input, selectedOptionId: row.data.selectedOption.id }).remove();
        if (traitRemoved) {
            this.generator.setGp(row.data.costs);
        }
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
            }
        }
        changeset.save();
    }
}