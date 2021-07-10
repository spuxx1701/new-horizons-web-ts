import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { set } from '@ember/object';

export default class StellarpediaSidebarChapterComponent extends Component {
    @service manager;
    @service stellarpediaService;

    @tracked book;
    @tracked chapter;
    @tracked expanded = false;

    @action onClick() {
        let sidebarData = this.stellarpediaService.sidebarData;
        let that = this;
        sidebarData.forEach(function (book) {
            if (book.id === that.book.id) {
                book.chapters.forEach(function (chapter) {
                    if (chapter.id === that.chapter.id) {
                        that.stellarpediaService.loadIntoSidebarData(book.id, chapter.id);
                        set(chapter, "expanded", !that.expanded);
                        return;
                    }
                })
            }
        });
    }
}