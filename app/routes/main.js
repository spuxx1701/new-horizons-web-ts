import Route from '@ember/routing/route';
import { action } from '@ember/object';
import RSVP from 'rsvp';

export default class MainRoute extends Route {
    model() {
        return RSVP.hash({
            localization: this.store.findAll("localization"),
        });
    }

    // @action loading(transition, originRoute) {
    //     console.log("loading!");
    //     let controller = this.controllerFor("main");
    //     controller.set("currentlyLoading", true);
    //     transition.promise.finally(function () {
    //         console.log("loaded!");
    //         controller.set("currentlyLoading", false);
    //     });
    //     return true;
    //     //   let controller = this.controllerFor('foo');
    //     //   controller.set('currentlyLoading', true);
    //     //return true; // allows the loading template to be shown
    // }
}
