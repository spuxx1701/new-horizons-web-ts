//  Leopold Hock | 30.04.2020
//  Description: Controller for template 'main'. Controls the the sidebars as well as the header toolbar.

import Controller from '@ember/controller';
import config from '../config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that;

export default class MainController extends Controller {
    @service manager;
    @service session;
    @tracked sidebarIconSize = "1";
    @tracked navSidebarExpanded = false;
    @tracked accountSidebarExpanded = false;

    init() {
        super.init();
        that = this;
    }

    @action
    toggleSidebar(id) {
        let isExpanded = that.get(id + "Expanded");
        if (isExpanded) {
            document.getElementById(id).style.width = null;
            if (!that.manager.isMobile) {
                if (id == "navSidebar") {
                    document.getElementById("pageOutlet").style.marginLeft = "0px";
                }
                else if (id == "accountSidebar") {
                    document.getElementById("pageOutlet").style.marginRight = "0px";
                }
            }
        } else {
            document.getElementById(id).style.width = "300px";
            if (!that.manager.isMobile) {
                let reduceBy = "300px";
                if (id == "navSidebar") {
                    document.getElementById("pageOutlet").style.marginLeft = reduceBy;
                }
                else if (id == "accountSidebar") {
                    document.getElementById("pageOutlet").style.marginRight = reduceBy;
                }
            }
        }
        that.set(id + "Expanded", !isExpanded);
    }
}