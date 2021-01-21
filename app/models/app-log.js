import Model, { attr } from '@ember-data/model';

export default class AppLogModel extends Model {
    @attr("string") timestamp;
    @attr("string") type;
    @attr("string") message;
}