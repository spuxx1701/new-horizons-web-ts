import Model, { attr, hasMany } from '@ember-data/model';

export default class StellarpediaModel extends Model {
    @hasMany("stellarpedia.sp-book") books;
}