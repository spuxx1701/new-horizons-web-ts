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
    @tracked bookIcon = "book"
    @tracked chapterIcon = "circle"

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
}