import Model, { attr, hasMany } from '@ember-data/model';
import { fragment, fragmentArray, array } from 'ember-data-model-fragments/attributes';

export default class StellarpediaModel extends Model {
    @fragmentArray("sp-chapter") chapters;
    //@hasMany("sp-chapter") chapters;
}