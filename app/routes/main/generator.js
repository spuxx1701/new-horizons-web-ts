import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';

export default class GeneratorRoute extends Route {
    model() {
        return RSVP.hash({
            /*abilities: this.store.findAll("database/ability"),
            appCategories: this.store.findAll("database/app-category"),
            apps: this.store.findAll("database/app"),*/
            characterPresets: this.store.findAll("database/character-preset"),
            /*constants: this.store.findAll("database/constant"),
            items: this.store.findAll("database/item"),
            origins: this.store.findAll("database/origin"),
            primaryAttributes: this.store.findAll("database/primary-attribute"),
            secondaryAttributes: this.store.findAll("database/secondary-attribute"),
            skillCategories: this.store.findAll("database/skill-category"),
            skills: this.store.findAll("database/skill"),
            specialisations: this.store.findAll("database/specialisation"),
            traits: this.store.findAll("database/trait"),
            weightModifiers: this.store.findAll("database/weight-modifier")*/
        });
    }

    @action
    didTransition() {
        this.controller.title = this.controller.manager.localizationService.getValue("Misc_NewCharacter");
        return true;
    }
}
