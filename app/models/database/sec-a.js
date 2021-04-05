import Model, { attr } from '@ember-data/model';

export default class DatabaseSecAModel extends Model {
    @attr() current;
    @attr() remaining;
    @attr() bonus;
    @attr() primaryAttributes;
    @attr() div;
}