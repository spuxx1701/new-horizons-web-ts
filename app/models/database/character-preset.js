import Model, { attr } from '@ember-data/model';

export default class DatabaseCharacterPresetModel extends Model {
    @attr() gpBonus;
    @attr() apAvailable;
    @attr() traitsMax;
    @attr() abilitiesMax;
    @attr() ipAvailable;
    @attr() epStart;
    @attr() crStart;
    @attr() fpStart;
}