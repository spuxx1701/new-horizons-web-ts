//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-21
// Description:
// Controller for nav-bar template 'stellarpedia'.
//----------------------------------------------------------------------------//

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class NavbarStellarpediaController extends Controller {
    @service manager;
    @service session;
    @service stellarpediaService;

    @tracked data;

    init() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Runs on initialization.
        //----------------------------------------------------------------------------//
        super.init();
        this.data = this.stellarpediaService.sidebarData;
    }

    @action
    returnToPrevious() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Returns to previous menu.
        //----------------------------------------------------------------------------//
        this.manager.goToRoute(this.manager.stellarpedia.returnRoute);
    }

    @action checkFocus() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Checks whether stellarpedia service expects the currently selected entry
        // to be focused in the navigation side bar. If so, adjusts the sidebar's
        // scroll position to focus the currently selected entry.
        //----------------------------------------------------------------------------//
        // update sidebar ui states if required
        if (this.stellarpediaService.updateScrollPositionAfterTransition) {
            this.stellarpediaService.set("updateScrollPositionAfterTransition", false);
            let buttonId = `sidebar-button-${this.stellarpediaService.selectedEntry.path}`;
            let button = document.getElementById(buttonId);
            let navSidebarContent = document.getElementById("navSidebarContent");
            if (button && navSidebarContent) {
                let offset = button.offsetTop - (navSidebarContent.clientHeight / 2);
                if (offset <= navSidebarContent.scrollHeight) {
                    if (offset >= 0) {
                        navSidebarContent.scrollTo(0, offset);
                    } else {
                        navSidebarContent.scrollTo(0, 0);
                    }
                } else {
                    navSidebarContent.scrollTo(0, navSidebarContent.scrollHeight);
                }
            }
        }
    }

    @action
    onReduceAllClick() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-21
        // Description:
        // Reduces all collapsed sidebar-groups.
        //----------------------------------------------------------------------------//
        let contentList = document.getElementsByClassName("sidebar-collapsible-content");
        for (let i = 0; i < contentList.length; i++) {
            contentList[i].style.maxHeight = null;
        }
    }
}