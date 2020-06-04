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
    @tracked sidebarIconSize = "1";

    init() {
        super.init();
        that = this;
    }
    @action
    goToPage(id) {
        that.manager.goToRoute(id);
    }
}