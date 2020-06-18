import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import DatabaseModel from './database';

export default class AbilityModel extends DatabaseModel {
    @hasMany("ability") ability;
}