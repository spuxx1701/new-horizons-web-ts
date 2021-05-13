import Model, { attr } from '@ember-data/model';

export default class DatabaseSecAModel extends Model {
    @attr() current;
    @attr() bonus;
    @attr() primaryAttributes;
    @attr() div;
}