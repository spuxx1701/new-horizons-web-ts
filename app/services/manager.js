//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-22
// Description: This is the central service for the entire application. The manager supplies the magnitude of utility
// functions this are not part of another independent service.
//----------------------------------------------------------------------------//
import Ember from 'ember';
import Service from '@ember/service';
import ENV from 'new-horizons-web/config/environment';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ManagerService extends Service {
    @service store;
    @service("constantService") constants;
    @service localizationService;
    @service messageService;
    @service("databaseService") database;
    @service("stellarpediaService") stellarpedia;
    @service router;
    @service modalService;
    @service session;

    // Input patterns
    @tracked pattern = {
        email: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/,
        emailAsString: "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$",
        password: /^[a-zA-Z0-9!@#$%&*()-+=^]{8,40}$/,
        passwordAsString: "^[a-zA-Z0-9!@#$%&*()-+=^]{8,40}$"
    }

    // System Variables
    @tracked devMode = false;
    @tracked isDesktop = false;
    @tracked msgType;

    init() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Initializer method.
        //----------------------------------------------------------------------------//
        super.init();
        if (ENV.environment === "development") this.devMode = true;
        // subscribe to routeDidChange event
        let that = this;
        this.router.on("routeDidChange", (transition) => {
            that.onTransition(transition);
        });
        this.renderNavbarMenu();
        this.log("Manager initialized.");
        this.msgType = this.messageService.msgType;
        // listen to media query event to keep isDesktop property updated
        let mediaQuery = window.matchMedia("(min-width: 768px)");
        this.onMediaChange(mediaQuery);
        mediaQuery.addListener(this.onMediaChange);
    }

    @action test() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Method for testing purposes only.
        //----------------------------------------------------------------------------//
        console.log(this.session);
    }

    @action goToRoute(id) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Calls router to transition to a specific subroute of main (default routing).
        //----------------------------------------------------------------------------//
        this.router.transitionTo("main." + id);
        if (this.isDesktop) {
            this.tryCloseSidebar("navSidebar");
            this.tryCloseSidebar("accountSidebar");
        }
    }

    @action onTransition(transition) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // This method is being called by the router after every transition.
        //----------------------------------------------------------------------------//
        this.renderNavbarMenu(transition);
    }

    @action renderNavbarMenu(transition) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // (Re-)Renders the nav-sidebar's content.
        //----------------------------------------------------------------------------//
        if (!this.router.currentRouteName) return;
        let currentRouteNameSplit = this.router.currentRouteName.split(".");
        if (currentRouteNameSplit.length > 1) {
            let combinedRouteName = currentRouteNameSplit[0] + "." + currentRouteNameSplit[1];
            // check whether this route has an own navbar template
            let navSidebarTemplate = Ember.getOwner(this).lookup("template:" + "nav-sidebar/" + currentRouteNameSplit[1]);
            let navSidebarController = Ember.getOwner(this).lookup("controller:" + "nav-sidebar/" + currentRouteNameSplit[1]);
            if (navSidebarTemplate && navSidebarController) {
                Ember.getOwner(this).lookup("route:" + combinedRouteName).render("nav-sidebar/" + currentRouteNameSplit[1], {
                    outlet: "navSidebarOutlet",
                    into: "main",
                    controller: "nav-sidebar/" + currentRouteNameSplit[1]
                });
            } else {
                // if none exists, render main navbar template
                Ember.getOwner(this).lookup("route:main").render("nav-sidebar/main", {
                    outlet: "navSidebarOutlet",
                    into: "main",
                    controller: "nav-sidebar/main"
                });
            }
        }
    }

    @action updateTabGroup(buttonGroupID, selectedID, classNameSelected) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Updates the nav-sidebar's tab group.
        //----------------------------------------------------------------------------//
        let buttonGroup = document.getElementById(buttonGroupID);
        if (!buttonGroup) {
            this.log("Unable to find control '" + buttonGroupID + "'.", this.manager.msgType.x);
            return;
        }
        for (var i = 0; i < buttonGroup.children.length; i++) {
            buttonGroup.children[i].classList.remove(classNameSelected);
        }
        document.getElementById(selectedID).classList.add(classNameSelected);
    }

    @action localize(key, allowUndefined = false) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Sends the input to the localizationService and returns its value.
        //----------------------------------------------------------------------------//
        return (this.localizationService.getValue(key, allowUndefined));
    }

    @action getIdentifiable(id) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Looks up the identifier with the databaseService and returns the result.
        //----------------------------------------------------------------------------//
        return this.database.getIdentifiable(id);
    }

    @action log(messageText, messageType = this.messageService.msgType.i, showToUser = false) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Calls messageService to log a specific message.
        //----------------------------------------------------------------------------//
        this.messageService.logMessage(messageText, messageType);
    }

    @action prepareId(id) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Adjusts an identifier to match the serialized identifier schema.
        //----------------------------------------------------------------------------//
        id = Ember.String.dasherize(id);
        return id;
    }

    @action showStellarpediaEntry(bookId, chapterId, entryId) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-08-22
        // Description:
        // Calls stellarpediaService to show a specific Stellarpedia article.
        //----------------------------------------------------------------------------//
        this.router.transitionTo("main.stellarpedia", this.prepareId(bookId) + "+" + this.prepareId(chapterId) + "+" + this.prepareId(entryId));
    }

    @action onMediaChange(mediaQuery) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-09
        // Description:
        // Is being triggered on media screen width change. Sets isDesktop property.
        //----------------------------------------------------------------------------//
        this.isDesktop = mediaQuery.matches;
    }

    @action tryCloseSidebar(id) {
        //----------------------------------------------------------------------------//
        // Leopold Hockh / 2020-09-11
        // Description:
        // This method tries to close the specified sidebar.
        //----------------------------------------------------------------------------//
        let mainController = Ember.getOwner(this).lookup("controller:main");
        if (id === "accountSidebar") {
            if (mainController.accountSidebarExpanded) mainController.toggleSidebar("accountSidebar");
        } else {
            if (mainController.navSidebarExpanded) mainController.toggleSidebar("navSidebar");
        }
    }

    @action callModal(type, args, listeners) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-19
        // Description:
        // Renders a specified modal.
        //----------------------------------------------------------------------------//
        this.modalService.render(type, args, listeners);
    }

    @action hideModal() {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2020-09-19
        // Description:
        // Hides the currently active modal.
        //----------------------------------------------------------------------------//
        this.modalService.hide();
    }

    @action isNullOrWhitespace(input) {
        //----------------------------------------------------------------------------//
        // Leopold Hock / 2021-01-20
        // Description:
        // Checks whether the input value is undefined, null, empty or contains
        // only whitespaces.
        //----------------------------------------------------------------------------//
        if (typeof input === 'undefined' || input == null) return true;
        return input.replace(/\s/g, '').length < 1;
    }

    @action getUrlParameters(url) {
        let result = [];
        let urlSplit = url.split("?");
        if (urlSplit[1]) {
            let parameterStrings = urlSplit[1].split("&");
            for (let parameterString of parameterStrings) {
                let parameterSplit = parameterString.split("=");
                if (parameterSplit.length === 2) {
                    result.push({ key: parameterSplit[0], value: parameterSplit[1] });
                }
            }
        }
        return result;
    }

    @action goToSignIn(type = "modal") {
        if (type === "modal" && this.router.currentRouteName !== "main.sign-in") {
            this.callModal("sign-in");
        } else {
            this.goToRoute("sign-in");
        }
    }
}