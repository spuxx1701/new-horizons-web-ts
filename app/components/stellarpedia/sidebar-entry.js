import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { computed, set } from '@ember/object';

export default class StellarpediaSidebarEntryComponent extends Component {
    @service manager;
    @service stellarpediaService;

    @tracked book;
    @tracked chapter;
    @tracked entry;
    @tracked selected = false;

    didRender() {
        this.checkFocus();
    }

    didUpdate() {
        this.checkFocus();
    }

    get highlighted() {
        let that = this;
        for (let book of this.stellarpediaService.sidebarData) {
            for (let chapter of book.chapters) {
                chapter.entries.forEach(function (entry) {
                    if (entry.selected && entry.path !== that.entry.path) {
                        set(entry, "selected", false);
                    }
                });
            }
        }
        return this.selected;
    }

    @action onClick(event) {
        this.manager.showStellarpediaEntry(this.book.id, this.chapter.id, this.entry.id);
    }

    @action checkFocus() {
        // update sidebar ui states if required
        if (this.selected && this.stellarpediaService.updateScrollPositionAfterTransition) {
            let sidebarController = Ember.getOwner(this).lookup("controller:nav-sidebar/stellarpedia");
            if (sidebarController) {
                sidebarController.checkFocus();
            }
        }
    }
}