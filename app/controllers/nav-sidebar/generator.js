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
    tabs = [{ id: "preset", icon: "sliders" },
    { id: "origin", icon: "globe" },
    { id: "personal", icon: "user-circle" },
    { id: "traits", icon: "star-half" },
    { id: "skills", icon: "bicycle" }];

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
        that.transitionToRoute("main.generator." + id);
    }

    updateButtonGroup(id) {
        that.manager.updateTabGroup("generator-tabs", "sidebar-button-" + id, "sidebar-button-2-selected");
    }
}