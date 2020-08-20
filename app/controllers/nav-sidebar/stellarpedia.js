//  Leopold Hock | 30.04.2020
//  Description: Controller for nav-bar template 'stellarpedia'.

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that = that;

export default class NavbarStellarpediaController extends Controller {
    @service manager;
    @service session;
    @tracked chapterIcon = "bookmark-o";
    @tracked entryIcon = "file-text-o";

    init() {
        super.init();
        that = this;
    }

    @action
    returnToMenu() {
        that.manager.goToRoute("home");
    }

    updateButtonGroup(id) {
        that.manager.updateTabGroup("generator-tabs", "sidebar-button-" + id, "sidebar-button-2-selected");
    }

    @action
    onBookClick(event) {
        let coll = event.currentTarget;
        let content = document.getElementById(coll.id + "-content");
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    }

    @action
    onChapterClick(bookId, event) {
        let coll = event.currentTarget;
        let content = document.getElementById(coll.id + "-content");
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            // expand book content
            let bookContent = document.getElementById("sidebar-button-" + bookId + "-content");
            bookContent.style.maxHeight = (bookContent.scrollHeight + content.scrollHeight) + "px";
        }
    }

    @action
    onEntryClick(entry, bookId, chapterId, event) {
        let button = event.currentTarget;
        this.manager.showStellarpediaEntry(bookId, chapterId, entry.id);
        this.selectEntry(entry, bookId, chapterId, button);
    }

    selectEntry(entry, bookId, chapterId, button = undefined) {
        let buttonList = document.getElementsByClassName("sidebar-collapsible");
        for (let i = 0; i < buttonList.length; i++) {
            buttonList[i].classList.remove("sidebar-collapsible-highlighted");
        }
        button.classList.add("sidebar-collapsible-highlighted");
        // expand chapter & book contents
        let bookContent = document.getElementById("sidebar-button-" + bookId + "-content");
        let chapterContent = document.getElementById("sidebar-button-" + bookId + "." + chapterId + "-content");
        chapterContent.style.maxHeight = chapterContent.scrollHeight + "px";
        bookContent.style.maxHeight = bookContent.scrollHeight + "px";
    }

    updateSelectedButton() {
        let button = document.getElementsById(this.manager.stellarpedia.selectedButtonId);
        if (button) {
            this.selectEntry(this.manager.selectedEntry, this.manager.stellarpedia.selectedBookId, this.manager.stellarpedia.selectedChapterId, button);
        }
    }

    @action
    onReduceAllClick() {
        let contentList = document.getElementsByClassName("sidebar-collapsible-content");
        for (let i = 0; i < contentList.length; i++) {
            contentList[i].style.maxHeight = null;
        }
    }
}