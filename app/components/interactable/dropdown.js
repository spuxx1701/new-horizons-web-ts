//  Leopold Hock | 18.06.2020
//  Description: Controller for component 'ui::dropdown'.
import InteractableComponent from './interactable';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class DropdownComponent extends InteractableComponent {
    @tracked caption;
    @tracked selectedIndex = 0;
    @tracked selectedId = "";

    init() {
        super.init()/*
        // supply all items with indices
        let items = this.get("items");
        for (let i = 0; i < items.content.length; i++) {
            items.content[i].index = i;
        }
        this.set(items.index = )*/
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

    @action
    onItemClicked(item) {
        if (this.get("disabled")) return;
        let items = this.get("items");
        let index = items.indexOf(item);
        this.set("selectedIndex", index);
        this.update();
    }

    @action
    update() {
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