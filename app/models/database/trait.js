import Model, { attr } from '@ember-data/model';

export default class DatabaseTraitModel extends Model {
    @attr() costs;
    @attr() hasLevel;
    @attr() level;
    @attr() minLevel;
    @attr() maxLevel;
    @attr() options;
    @attr() needsInput;
    @attr() input;
    @attr() targets;
    @attr() requirements;
    @attr() restrictions;
}