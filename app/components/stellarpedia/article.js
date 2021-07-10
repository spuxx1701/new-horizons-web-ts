import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { htmlSafe } from '@ember/template';

export default class StellarpediaRowComponent extends Component {
    @service manager;
    @service stellarpediaService;

    @tracked titleAlignment = "left";

    // @action didRender() {
    //     // update sidebar ui states if required
    //     if (this.stellarpediaService.updateScrollPositionAfterTransition) {
    //         let sidebarController = Ember.getOwner(this).lookup("controller:nav-sidebar/stellarpedia");
    //         if (sidebarController) {
    //             sidebarController.checkFocus();
    //         }
    //     }
    // }
}