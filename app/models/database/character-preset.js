import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import DatabaseModel from './database';

export default class CharacterPresetModel extends DatabaseModel {
    @attr("number") gpBonus;
    @attr("number") gpAvailable;
    @attr("number") traitsMax;
    @attr("number") abilitiesMax;
    @attr("number") ipAvailable;
    @attr("number") epStart;
    @attr("number") crStart;
    @attr("number") fpStart;
}