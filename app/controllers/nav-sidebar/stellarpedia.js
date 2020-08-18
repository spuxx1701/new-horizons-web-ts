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

    @action
    goToTab(id) {
        that.updateButtonGroup(id);
        that.transitionToRoute("main.generator." + id);
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
    onChapterClick(event) {
        let coll = event.currentTarget;
        let content = document.getElementById(coll.id + "-content");
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    }

    @action
    onEntryClick(entry, event) {
        let buttonList = document.getElementsByClassName("sidebar-collapsible");
        for (let i = 0; i < buttonList.length; i++) {
            buttonList[i].classList.remove("sidebar-collapsible-highlighted");
        }
        let button = event.currentTarget;
        button.classList.add("sidebar-collapsible-highlighted");
        this.manager.stellarpedia.setSelectedEntry(entry);
    }

    @action
    onReduceAllClick() {
        let contentList = document.getElementsByClassName("sidebar-collapsible-content");
        for (let i = 0; i < contentList.length; i++) {
            contentList[i].style.maxHeight = null;
        }
    }
}