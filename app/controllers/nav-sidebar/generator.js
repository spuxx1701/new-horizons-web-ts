//  Leopold Hock | 30.04.2020
//  Description: Controller for template 'main'. Controls the the sidebars as well as the header toolbar.

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class NavbarGeneratorController extends Controller {
    @service manager;
    @service generator;
    @service session;
    tabs = [{ id: "personal", icon: "user-circle", routeName: "main.generator.personal" },
    { id: "attributes", icon: "running", routeName: "main.generator.attributes" },
    { id: "traits", icon: "yin-yang", routeName: "main.generator.traits" },
    { id: "skills", icon: "biking", routeName: "main.generator.skills" },
    { id: "abilities", icon: "book-open", routeName: "main.generator.abilities" },
    { id: "apps", icon: "mobile-alt", routeName: "main.generator.apps" },
    { id: "inventory", icon: "suitcase", routeName: "main.generator.inventory" },
    { id: "finish", icon: "tasks", routeName: "main.generator.finish" },
    ];

    init() {
        super.init();
    }

    @action
    returnToMenu() {
        this.manager.goToRoute("home");
    }

    @action
    goToTab(id) {
        this.transitionToRoute("main.generator." + id);
    }
}