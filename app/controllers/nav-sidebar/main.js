//  Leopold Hock | 30.04.2020
//  Description: Controller for template 'main'. Controls the the sidebars as well as the header toolbar.

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class NavbarMainController extends Controller {
    @service manager;
    @service session;

    init() {
        super.init();
    }
    @action goToTab(id, showAsSelected) {
        this.manager.goToRoute(id);
        if (!this.manager.isDesktop) {
            this.manager.tryCloseSidebar("navSidebar");
        }
    }

    @action goToDiscord() {
        window.open("https://discord.gg/anSjdatqby");
    }

    @action updateTabGroup(buttonGroupID, selectedID, classNameSelected) {
        let buttonGroup = document.getElementById(buttonGroupID);
        if (!buttonGroup) {
            this.manager.log("Unable to find control '" + buttonGroupID + "'.", this.manager.msgType.x);
            return;
        } else if (!document.getElementById(selectedID)) {
            this.manager.log("Unable to find control '" + selectedID + "'.", this.manager.msgType.x);
            return;
        }
        for (let i = 0; i < buttonGroup.children.length; i++) {
            buttonGroup.children[i].classList.remove(classNameSelected);
        }
        document.getElementById(selectedID).classList.add(classNameSelected);
    }
}