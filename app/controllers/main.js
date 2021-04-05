//  Leopold Hock | 30.04.2020
//  Description: Controller for template 'main'. Controls the the sidebars as well as the header toolbar.

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that;

export default class MainController extends Controller {
    @service manager;
    @service session;
    @service modalService;
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
            if (id == "navSidebar") {
                document.getElementById("pageOutletContainer").style.marginLeft = "0px";
            }
            else if (id == "accountSidebar") {
                document.getElementById("pageOutletContainer").style.marginRight = "0px";
            }
        } else {
            let expandedWidth = "300px";
            // let viewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
            // let pageOutletViewportDiff = viewportWidth - document.getElementById("pageOutletContainer").offsetWidth;
            // let reduceBy = (300 - (pageOutletViewportDiff / 2)) + "px";
            let reduceBy = "300px";
            document.getElementById(id).style.width = expandedWidth;
            if (this.manager.isDesktop) {
                if (id == "navSidebar") {
                    document.getElementById("pageOutletContainer").style.marginLeft = reduceBy;
                }
                else if (id == "accountSidebar") {
                    document.getElementById("pageOutletContainer").style.marginRight = reduceBy;
                }
            } else {
                if (this.accountSidebarExpanded) {
                    document.getElementById("accountSidebar").style.width = null;
                    this.accountSidebarExpanded = false;
                }
                if (this.navSidebarExpanded) {
                    document.getElementById("navSidebar").style.width = null;
                    this.navSidebarExpanded = false;
                }
            }
        }
        that.set(id + "Expanded", !isExpanded);
    }

    @action callSignOutModal() {
        let modalTitle = { "name": "title", "value": "Modal_SignOut_Title" };
        let modalText = { "name": "text", "value": ["Modal_SignOut_Text01"] };
        let yesLabel = { "name": "yesLabel", "value": "Misc_Yes" };
        let noLabel = { "name": "noLabel", "value": "Misc_No" };
        let yesListener = {
            "event": "click", "id": "modal-button-footer-yes", "function": async function () {
                that.manager.hideModal();
                await that.session.invalidate("authenticator:jwt");
            }
        }
        let noListener = {
            "event": "click", "id": "modal-button-footer-no", "function": function () {
                that.manager.hideModal();
            }
        }
        this.manager.callModal("confirm", [undefined, modalTitle, modalText, yesLabel, noLabel], [yesListener, noListener]);
    }
}