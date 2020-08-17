import Model, { attr, hasMany } from '@ember-data/model';

export default class StellarpediaBookModel extends Model {
    @belongsTo("sp-book") book;
    @attr("string") id;
    @hasMany("sp-entry") entries;
}