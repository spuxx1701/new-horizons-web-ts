import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { action } from '@ember/object';

export default class MainGeneratorPresetRoute extends Route {
    model() {
        return RSVP.hash({
            characterPresets: this.store.findAll("database/character-preset")
        });
    }

    @action
    didTransition() {
        this.controller.onChangePreset(this.controller.manager.constants.characterPresetIdDefault);
        return true;
    }
}
