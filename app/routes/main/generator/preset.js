import Route from '@ember/routing/route';
import RSVP from 'rsvp';

export default class MainGeneratorPresetRoute extends Route {
    model() {
        return RSVP.hash({
            characterPresets: this.store.findAll("database/character-preset")
        });
    }
}
