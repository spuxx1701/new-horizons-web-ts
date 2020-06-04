//  Leopold Hock | 30.04.2020
//  Description: Controller for template 'main'. Controls the the sidebars as well as the header toolbar.

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that = that;

export default class NavbarGeneratorController extends Controller {
    @service manager;
    @service session;
    @tracked sidebarIconSize = "1";
    tabs = [{ id: "preset", icon: "cog" },
    { id: "origin", icon: "cog" },
    { id: "personal", icon: "cog" },
    { id: "traits", icon: "cog" },
    { id: "skills", icon: "cog" }];

    init() {
        super.init();
        that = this;
        //that.updateButtonGroup(that.tabs[0].id);
    }

    @action
    returnToMenu() {
        that.manager.goToRoute("home");
    }

    @action
    goToTab(id) {
        that.updateButtonGroup(id);
        that.transitionToRoute("generator." + id);
    }

    updateButtonGroup(id) {
        that.manager.updateTabGroup("generator-tabs", "tab-button-" + id, "sidebar-button-2-selected");
    }
}