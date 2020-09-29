//  Leopold Hock | 18.06.2020
//  Description: Controller for component 'Interactable::Dropdown'.
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class DropdownComponent extends InteractableComponent {
    @service manager;
    @tracked caption;
    @tracked selectedIndex = 0;
    @tracked selectedId = "";

    init() {
        super.init()
    }

    willRender() {
        let items = this.get("items");
        if (!items || items.content.length < 0) {
            this.set("caption", this.manager.localize("Misc_NoData"));
            this.set("disabled", true);
        } else {
            this.set("disabled", this.get("forceDisable"));
            this.update();
        }
    }

    // internal event that handles dropdown selection
    @action onItemClicked(item) {
        // do dropdown specific stuff
        if (this.get("disabled")) return;
        let items = this.get("items");
        let index = items.indexOf(item);
        this.set("selectedIndex", index);
        this.update();
        // try to call onChange(itemID, index)
        if (typeof this.onChange === this.manager.constants.typeOfFunction) {
            this.onChange(this.get("selectedId"), this.get("selectedIndex"));
        } else {
            this.manager.log("Calling onChange(itemID, index) from dropdown component has failed because method has not been subscribed in parent template.", this.manager.msgType.x);
        }
    }

    // update dropdown state internally
    @action update() {
        let items = this.get("items");
        // visualize and, if required, adjust the current selected item
        if (this.get("selectedIndex") >= items.content.length)
            this.set("selectedIndex", items.content.length - 1);
        for (let i = 0; i < items.content.length; i++) {
            if (i == this.get("selectedIndex")) {
                this.set("caption", this.manager.localize(items.content[i].id));
                this.set("selectedId", items.content[i].id);
            }
        }
    }
}