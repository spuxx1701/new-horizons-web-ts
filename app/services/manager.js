//  Leopold Hock | 30.04.2020
//  Description: This is the central service for the entire application. The manager supplies the magnitude of utility
//  functions that are not part of another independent service.

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
        super.init();
        that = this;
        if (config.environment === "development") that.devMode = true;
        // subscribe to routeDidChange event
        that.router.on("routeDidChange", (transition) => {
            that.onTransition();
        });
        that.renderNavbarMenu();
        that.log("Manager initialized.");
    }

    @action
    async test() {
        let result = await this.stellarpedia.get("BasicRules");
        console.log(result);
    }

    goToRoute(id) {
        that.router.transitionTo("main." + id);
    }

    onTransition() {
        if (!that.router.currentRouteName) return;
        let currentRouteNameSplit = that.router.currentRouteName.split(".");
        currentRouteNameSplit.forEach(function (routeName, index) {
            let combinedRouteName = "";
            for (let i = 0; i <= index; i++) {
                combinedRouteName += currentRouteNameSplit[i];
                if (i < index) combinedRouteName += ".";
            }
            try {
                // try to initialize that route's controller
                Ember.getOwner(that).lookup("controller:" + combinedRouteName).onTransition();
            } catch (exception) {
                // do nothing
            }
        });
        that.renderNavbarMenu();
    }

    renderNavbarMenu() {
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
        return (that.localizationService.getValue(key));
    }

    getIdentifiable(id) {
        return that.databaseService.getIdentifiable(id);
    }

    log(messageText, messageType = "info") {
        that.messageService.logMessage(messageText, messageType);
    }

    // Dasherize id
    prepareId(id) {
        id = Ember.String.dasherize(id.replace("_", "/"));
        return id;
    }
}