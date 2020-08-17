import Model, { attr, hasMany } from '@ember-data/model';

export default class StellarpediaElementModel extends Model {
    @belongsTo("sp-entry") entry;
    @attr("string") element;
}