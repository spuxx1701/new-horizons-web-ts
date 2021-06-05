//  Leopold Hock | 18.06.2020
//  Description: Controller for component 'Interactable::Dropdown'.
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { computed, set } from '@ember/object';

export default class DropdownComponent extends InteractableComponent {
    @service manager;
    @tracked selectedItem;
    @tracked firstItem;
    @tracked lastItem;
    hasRendered = false;
    loop = true;
    disabled = false;

    init() {
        super.init()
    }

    willRender() {
        if (!this.hasRendered) {
            let items = this.get("items").content || this.get("items");
            let defaultItem;
            for (let i = 0; i < items.length; i++) {
                if (this.default && items[i].id === this.default) {
                    defaultItem = items[i];
                }
            }
            if (defaultItem) {
                this.onItemClicked(defaultItem);
            } else {
                this.onItemClicked(items[0]);
            }
            this.hasRendered = true;
        }
    }

    @computed("disabled", "items")
    get isDisabled() {
        let items = this.get("items").content || this.get("items");
        if (!items || items.length === 0) {
            return true;
        } else {
            return this.get("disabled");
        }
    }

    @computed("selectedItem", "items")
    get caption() {
        let items = this.get("items").conrent || this.get("items");
        if (!items || items.length === 0) {
            return this.manager.localize("Misc_NoData");
        } else {
            this.set("firstItem", items[0]);
            this.set("lastItem", items[items.length - 1]);
            if (this.get("selectedItem")) {
                return this.manager.localize(this.get("selectedItem").id);
            } else {
                return this.manager.localize(items[0].id);
            }
        }
    }

    // internal event that handles dropdown selection
    @action onItemClicked(item) {
        if (this.isDisabled) return;
        // do dropdown specific stuff
        this.set("selectedItem", item);
        // try to set changeset value
        if (this.get("changeset") && this.get("key")) {
            this.get("changeset").set(this.get("key"), item.id);
        }
        // try to call onChange(itemID)
        if (typeof this.onChangeListener === this.manager.constants.typeOfFunction) {
            this.onChangeListener(item.id, { key: this.get("key"), changeset: this.get("changeset") });
        }
    }

    @action onPreviousClick(event) {
        this.selectNextItem(false);
    }

    @action onNextClick(event) {
        this.selectNextItem(true);
    }

    // Select next dropdown item
    @action selectNextItem(forward = true) {
        let items = this.get("items").content || this.get("items");
        for (let i = 0; i < items.length; i++) {
            if (items[i].id === this.get("selectedItem").id) {
                let newIndex;
                // Select next or previous item
                if (forward) {
                    newIndex = i + 1;
                } else {
                    newIndex = i - 1;
                }
                // Check if index is valid
                if (newIndex < 0 || newIndex >= items.length) {
                    // If it isn't, select first or final item depending on 'loop' parameter
                    if (this.loop) {
                        if (newIndex < 0) {
                            newIndex = items.length - 1;
                        } else {
                            newIndex = 0;
                        }
                    } else {
                        if (newIndex < 0) {
                            newIndex = 0;
                        } else {
                            newIndex = items.length - 1;
                        }
                    }
                }
                this.onItemClicked(items[newIndex]);
                break;
            }
        }
    }
}