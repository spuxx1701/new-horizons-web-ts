import Model, { attr } from '@ember-data/model';

export default class DatabasePriAModel extends Model {
    @attr() current;
    @attr() start;
    @attr() min;
    @attr() max;
}