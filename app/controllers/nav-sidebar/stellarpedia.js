//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-21
// Description:
// Controller for nav-bar template 'stellarpedia'.
//----------------------------------------------------------------------------//

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import EmberResolver from 'ember-resolver';
var that = that;

export default class NavbarStellarpediaController extends Controller {
    @service manager;
    @service session;
    @tracked chapterIcon = "bookmark-o";
    @tracked entryIcon = "file-text-o";

    init() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Runs on initialization.
        //----------------------------------------------------------------------------//
        super.init();
        that = this;
    }

    @action
    returnToPrevious() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Returns to previous menu.
        //----------------------------------------------------------------------------//
        that.manager.goToRoute("home");
    }

    @action
    onBookClick(event) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Is being triggered when a book is being clicked.
        //----------------------------------------------------------------------------//
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
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Is being triggered when a chapter is being clicked.
        //----------------------------------------------------------------------------//
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
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Is being triggered when an entry is being clicked.
        //----------------------------------------------------------------------------//
        let button = event.currentTarget;
        this.manager.showStellarpediaEntry(bookId, chapterId, entry.id);
        this.selectEntry(bookId, chapterId, button, true);
    }

    selectEntry(bookId, chapterId, button, hasBeenClicked = false) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Selects a button and collapses the groups it belongs to.
        //----------------------------------------------------------------------------//
        let buttonList = document.getElementsByClassName("sidebar-collapsible");
        for (let i = 0; i < buttonList.length; i++) {
            buttonList[i].classList.remove("sidebar-collapsible-highlighted");
        }
        button.classList.add("sidebar-collapsible-highlighted");
        // expand chapter & book contents if button has not been clicked manually
        if (!hasBeenClicked) {
            let bookContent = document.getElementById("sidebar-button-" + bookId + "-content");
            let chapterContent = document.getElementById("sidebar-button-" + bookId + "." + chapterId + "-content");
            // override transition
            bookContent.style.transition = "0ms";
            chapterContent.style.transition = "0ms";
            // adjust height
            chapterContent.style.maxHeight = chapterContent.scrollHeight + "px";
            bookContent.style.maxHeight = bookContent.scrollHeight + "px";
            // adjust scroll position
            let navSidebarContent = document.getElementById("navSidebarContent");
            let offset = button.offsetTop - (navSidebarContent.clientHeight / 2);
            if (offset <= navSidebarContent.scrollHeight) {
                if (offset >= 0) {
                    navSidebarContent.scrollTo(0, offset);
                } else {
                    navSidebarContent.scrollTo(0, 0);
                }
            } else {
                navSidebarContent.scrollTo(0, navSidebarContent.scrollHeight);
            }
            bookContent.style.transition = null;
            chapterContent.style.transition = null;
        }
    }

    @action
    updateSelectedButton() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Is being called by did-render modifier to update selection in hierarchy
        // to match selected*-properties of stellarpedia service.
        //----------------------------------------------------------------------------//
        let buttonId = "sidebar-button-" + this.manager.stellarpedia.selectedBookId + "." + this.manager.stellarpedia.selectedChapterId + "." + this.manager.stellarpedia.selectedEntry.id;
        let button = document.getElementById(buttonId);
        if (button) {
            this.selectEntry(this.manager.stellarpedia.selectedBookId, this.manager.stellarpedia.selectedChapterId, button);
        }
    }

    @action
    onReduceAllClick() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Reduces all collapsed sidebar-groups.
        //----------------------------------------------------------------------------//
        let contentList = document.getElementsByClassName("sidebar-collapsible-content");
        for (let i = 0; i < contentList.length; i++) {
            contentList[i].style.maxHeight = null;
        }
    }
}