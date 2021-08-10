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
        // Check requirements
        let requirementCheckResult = this.generator.getCharacter().meetsRequirements(row.data.requirements, { detailedResult: true });
        if (!requirementCheckResult.result) {
            let texts = ["Modal_CharacterDoesNotMeetRequirements_Text"];
            for (let failedRequirement of requirementCheckResult.failedRequirements) {
                if (failedRequirement.level > 0) {
                    texts.push(`${this.manager.localize(failedRequirement.id)} (${failedRequirement.level})`);
                } else {
                    texts.push(`${this.manager.localize(failedRequirement.id)}`);
                }
            }
            this.manager.callModal("confirm", [{ name: "title", value: "Modal_CharacterDoesNotMeetRequirements_Title" }, { name: "text", value: ["Modal_CharacterDoesNotMeetRequirements_Text"] }]);
        }

        if (row.data.needsInput) {
            if (this.manager.isNullOrWhitespace(row.data.input)) {
                // If trait needs input,  check for valid input
                set(trait, "invalid", true);
            } else if (this.generator.getCharacter().getTrait(row.data.id, { input: row.changeset.input })) {
                // If trait needs input, check whether the character has the same trait with the same input
                this.manager.callModal("confirm", [{ name: "title", value: "Modal_CharacterOwnsTrait_Title" }, { name: "text", value: ["Modal_CharacterOwnsTrait_Text"] }]);
            } else {
                row.data.addToCharacter(this.generator.getCharacter(), { input: row.changeset.input });
            }
        } else if (row.data.hasOptions) {
            if (this.generator.getCharacter().getTrait(row.data.id, { selectedOption: row.data.selectedOption })) {
                // If trait has options, check whether the character has the same trait with the same option
                this.manager.callModal("confirm", [{ name: "title", value: "Modal_CharacterOwnsTrait_Title" }, { name: "text", value: ["Modal_CharacterOwnsTrait_Text"] }]);
            } else {
                row.data.addToCharacter(this.generator.getCharacter(), { selectedOption: row.data.selectedOption });
            }
        } else {
            // Else, just check whether the character already has that trait
            if (this.generator.getCharacter().getTrait(row.data.id)) {
                this.manager.callModal("confirm", [{ name: "title", value: "Modal_CharacterOwnsTrait_Title" }, { name: "text", value: ["Modal_CharacterOwnsTrait_Text"] }]);
            } else {
                row.data.addToCharacter(this.generator.getCharacter());
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