import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class StellarpediaRoute extends Route {
    @service stellarpediaService;

    async model(params) {
        if (!this.stellarpediaService.data) await this.stellarpediaService.load();
        let fullEntryAdress = params.fullEntryAdress;
        let split = fullEntryAdress.split("+");
        if (split.length >= 3) {
            this.stellarpediaService.setSelectedEntry(split[0], split[1], split[2]);
        } else {
            // throw error
        }
    }

    @action
    afterModel(posts, transition) {
        let bookId = this.stellarpediaService.selectedBookId;
        let chapterId = this.stellarpediaService.selectedChapterId;
        let entry = this.stellarpediaService.selectedEntry;
        if (bookId && chapterId && entry) {
            let selectedButtonId = "sidebar-button-" + bookId + "." + chapterId + "." + entry.id;
            console.log(selectedButtonId);
            let button = document.getElementById(selectedButtonId);
            let navbarController =  Ember.getOwner(this).lookup("controller:nav-sidebar/stellarpedia");
            console.log(button);
            console.log(navbarController);
            if (button && navbarController) navbarController.selectEntry(entry.id, bookId, chapterId, button = undefined)
        }
        return true;
    }
}
