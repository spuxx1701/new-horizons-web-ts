import Model, { attr, hasMany, belongsTo } from '@ember-data/model';

export default class ValueReferenceModel extends Model {
    @belongsTo("ability") abilities;

    @attr("string") type;
    @attr("string") input;
    @attr("number") level;
    @attr("boolean") overrideCurrent;
    @attr("number") oldLevel;
}