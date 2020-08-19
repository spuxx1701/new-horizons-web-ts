import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import DatabaseModel from './database';

export default class PrimaryAttributeModel extends DatabaseModel {
    @attr("number") current;
    @attr("number") start;
    @attr("number") min;
    @attr("number") max;
    @attr("number") bonus;
}