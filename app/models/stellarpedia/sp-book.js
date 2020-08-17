import Model, { attr, hasMany } from '@ember-data/model';

export default class StellarpediaBookModel extends Model {
    @belongsTo("stellarpedia") stellarpedia;
    @attr("string") id;
    @hasMany("sp-chapter") chapters;
}