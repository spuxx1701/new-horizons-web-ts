import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { set } from '@ember/object';

export default class StellarpediaSidebarBookComponent extends Component {
    @service manager;
    @service stellarpediaService;

    @tracked book;
    @tracked expanded = false;

    @action onClick() {
        let sidebarData = this.stellarpediaService.sidebarData;
        let that = this;
        sidebarData.forEach(function (book) {
            if (book.id === that.book.id) {
                that.stellarpediaService.loadIntoSidebarData(book.id);
                set(book, "expanded", !that.expanded);
                return;
            }
        });
    }
}