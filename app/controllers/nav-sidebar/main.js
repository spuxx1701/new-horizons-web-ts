//  Leopold Hock | 30.04.2020
//  Description: Controller for template 'main'. Controls the the sidebars as well as the header toolbar.

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that = that;

export default class NavbarMainController extends Controller {
    @service manager;
    @service session;

    init() {
        super.init();
        that = this;
    }
    @action
    goToTab(id, showAsSelected) {
        that.manager.goToRoute(id);
        /*let splitID = id.split(".");
        if (showAsSelected) {
            that.updateTabGroup("main-tabs", "sidebar-button-" + splitID[splitID.length - 1], "sidebar-button-2-selected");
        }*/
    }

    updateTabGroup(buttonGroupID, selectedID, classNameSelected) {
        let buttonGroup = document.getElementById(buttonGroupID);
        if (!buttonGroup) {
            that.manager.log("error", "Unable to find control '" + buttonGroupID + "'.");
            return;
        } else if (!document.getElementById(selectedID)) {
            that.manager.log("error", "Unable to find control '" + selectedID + "'.");
            return;
        }
        for (let i = 0; i < buttonGroup.children.length; i++) {
            buttonGroup.children[i].classList.remove(classNameSelected);
        }
        document.getElementById(selectedID).classList.add(classNameSelected);
    }
}