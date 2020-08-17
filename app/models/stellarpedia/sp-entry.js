import Model, { attr, hasMany } from '@ember-data/model';

export default class StellarpediaBookModel extends Model {
    @belongsTo("sp-chapter") chapter;
    @attr("string") id;
    @hasMany("sp-element") elements;
}