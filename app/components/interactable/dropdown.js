//  Leopold Hock | 18.06.2020
//  Description: Controller for component 'Interactable::Dropdown'.
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class DropdownComponent extends InteractableComponent {
    @service manager;
    @tracked caption;
    @tracked selectedItem;
    @tracked firstItem;
    @tracked lastItem;
    hasRendered = false;

    init() {
        super.init()
    }

    willRender() {
        if (!this.hasRendered) {
            let items = this.get("items");
            // check whether the dropdown actually contains data
            if (!items || items.content.length === 0) {
                this.set("caption", this.manager.localize("Misc_NoData"));
                this.set("disabled", true);
            } else {
                this.set("firstItem", items.content[0]);
                this.set("selectedItem", items.content[0]);
                this.set("lastItem", items.content[items.content.length - 1]);
                this.set("disabled", this.get("forceDisable"));
                this.onItemClicked(items.content[0]);
            }
            this.hasRendered = true;
        }
    }

    // internal event that handles dropdown selection
    @action onItemClicked(item) {
        // do dropdown specific stuff
        if (this.get("disabled")) return;
        this.set("selectedItem", item);
        // try to call onChange(itemID, index)
        if (typeof this.onChange === this.manager.constants.typeOfFunction) {
            this.onChange(item.id);
        } else {
            this.manager.log("Calling onChange(itemID, index) from dropdown component has failed because method has not been subscribed in parent template.", this.manager.msgType.x);
        }
        this.update();
    }

    // update dropdown state internally
    @action update() {
        // let items = this.get("items");
        // let selectedItemIndex = items.indexOf(this.get("selectedItem"));
        // visualize and, if required, adjust the current selected item
        // if (this.get("selectedIndex") >= items.content.length)
        //     this.set("selectedIndex", items.content.length - 1);
        this.set("caption", this.manager.localize(this.get("selectedItem").id));
    }
}