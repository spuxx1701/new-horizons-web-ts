import Route from '@ember/routing/route';

export default class MainGeneratorPresetRoute extends Route {
    model() {
        return this.store.findAll("database/character-preset");
    }
}
