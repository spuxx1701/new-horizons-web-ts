import Model, { attr, hasMany } from '@ember-data/model';

export default class LocalizationModel extends Model {
    @attr("string") key;
    @attr("string") value
}