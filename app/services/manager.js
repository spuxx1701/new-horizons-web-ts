//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-22
// Description:
// Description: This is the central service for the entire application. The manager supplies the magnitude of utility
// functions that are not part of another independent service.
//----------------------------------------------------------------------------//
import Ember from 'ember';
import Service from '@ember/service';
import config from '../config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
var that;

export default class ManagerService extends Service {
    @service store;
    @service("constantService") constants;
    @service localizationService;
    @service messageService;
    @service("databaseService") database;
    @service("stellarpediaService") stellarpedia;
    @service router;

    // System Variables
    @tracked devMode = false;
    @tracked isMobile = false;

    init() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Initializer method.
        //----------------------------------------------------------------------------//
        super.init();
        that = this;
        if (config.environment === "development") that.devMode = true;
        // subscribe to routeDidChange event
        that.router.on("routeDidChange", (transition) => {
            that.onTransition(transition);
        });
        that.renderNavbarMenu();
        that.log("Manager initialized.");
    }

    @action
    async test() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Testing method.
        //----------------------------------------------------------------------------//
        let result = await this.stellarpedia.get("BasicRules");
        console.log(result);
    }

    goToRoute(id) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Calls router to transition to a specific subroute of main (default routing).
        //----------------------------------------------------------------------------//
        that.router.transitionTo("main." + id);
    }

    onTransition(transition) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // This method is being called by the router after every transition.
        //----------------------------------------------------------------------------//
        that.renderNavbarMenu(transition);
    }

    renderNavbarMenu(transition) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // (Re-)Renders the nav-sidebar's content.
        //----------------------------------------------------------------------------//
        if (!that.router.currentRouteName) return;
        let currentRouteNameSplit = that.router.currentRouteName.split(".");
        if (currentRouteNameSplit.length > 1) {
            let combinedRouteName = currentRouteNameSplit[0] + "." + currentRouteNameSplit[1];
            try {
                // check whether this route has an own navbar template
                Ember.getOwner(that).lookup("route:" + combinedRouteName).render("nav-sidebar/" + currentRouteNameSplit[1], {
                    outlet: "navSidebarOutlet",
                    into: "main",
                    controller: "nav-sidebar/" + currentRouteNameSplit[1]
                });
            } catch (exception) {
                // if that fails, render main navbar template
                Ember.getOwner(that).lookup("route:main").render("nav-sidebar/main", {
                    outlet: "navSidebarOutlet",
                    into: "main",
                    controller: "nav-sidebar/main"
                });
            }
        }
    }

    updateTabGroup(buttonGroupID, selectedID, classNameSelected) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Updates the nav-sidebar's tab group.
        //----------------------------------------------------------------------------//
        let buttonGroup = document.getElementById(buttonGroupID);
        if (!buttonGroup) {
            that.log("error", "Unable to find control '" + buttonGroupID + "'.");
            return;
        }
        for (var i = 0; i < buttonGroup.children.length; i++) {
            buttonGroup.children[i].classList.remove(classNameSelected);
        }
        document.getElementById(selectedID).classList.add(classNameSelected);
    }

    localize(key) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Sends the input to the localizationService and returns its value.
        //----------------------------------------------------------------------------//
        return (that.localizationService.getValue(key));
    }

    getIdentifiable(id) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Looks up the identifier with the databaseService and returns the result.
        //----------------------------------------------------------------------------//
        return that.database.getIdentifiable(id);
    }

    log(messageText, messageType = "info") {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Calls messageService to log a specific message.
        //----------------------------------------------------------------------------//
        that.messageService.logMessage(messageText, messageType);
    }

    prepareId(id) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Adjusts an identifier to match the serialized identifier schema.
        //----------------------------------------------------------------------------//
        id = Ember.String.dasherize(id.replaceAll(/_/g, "/"));
        return id;
    }

    showStellarpediaEntry(bookId, chapterId, entryId, returnRoute = "main.home") {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Calls stellarpediaService to show a specific Stellarpedia article.
        //----------------------------------------------------------------------------//
        that.router.transitionTo("main.stellarpedia", that.prepareId(bookId) + "+" + that.prepareId(chapterId) + "+" + that.prepareId(entryId));
    }
}