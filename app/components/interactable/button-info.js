//----------------------------------------------------------------------------//
// Leopold Hock / 2021-01-21
// Description:
// Controller for component interactable::button.
//----------------------------------------------------------------------------//
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { computed, set } from '@ember/object';

export default class DropdownComponent extends InteractableComponent {
    @service manager;
    @service stellarpediaService;

    @action onClick(event) {
        let articleId = this.manager.database.transformId(this.get("article"));
        let split = articleId.split("/");
        if (!Array.isArray(split) || split.length < 3) {
            this.manager.log("Invalid Stellarpedia path: " + articleId, this.manager.messageService.msgType.x);
        } else {
            let entryId;
            if (split.length === 3) {
                entryId = split[2];
            } else {
                entryId = "";
                for (let i = 2; i < split.length; i++) {
                    entryId = entryId + split[i];
                    if (i < split.length - 1) {
                        entryId = entryId + "/";
                    }
                }
            }
            this.manager.showStellarpediaEntry(split[0], split[1], entryId);
        }
    }
}