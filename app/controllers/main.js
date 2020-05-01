//  Leopold Hock | 30.04.2020
//  Description: Controller for template 'main'. Controls the the sidebars as well as the header toolbar.

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
var that = that;

export default class ApplicationController extends Controller {
    @service manager;
    @service session;

    init() {
        super.init();
        that = this;
    }

    @action
    test() {
        console.log(that.manager.localizationService.getValue("Misc_NotSignedIn"));
    }

    @action
    openSidebar(id) {
        document.getElementById(id).style.width = "80%";
    }

    @action
    closeSidebar(id) {
        document.getElementById(id).style.width = "0px";
    }
}