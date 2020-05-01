import Model, { attr } from '@ember-data/model';

export default class LocalizationModel extends Model {
    @hasMany("localizationItem") items;
}

export class LocalizationItemmodel extends Model {
    @attr("string") key;
    @attr("string") value;
}