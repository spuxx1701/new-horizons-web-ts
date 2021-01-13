import Model, { attr } from '@ember-data/model';

export default class DatabaseModel extends Model {
    @attr("string") description;
    @attr("string") reproduction;
    @attr("string") applog;
    @attr("string") email;
}