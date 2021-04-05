import Model, { attr } from '@ember-data/model';

export default class DatabaseAppModel extends Model {
    @attr() appCategory;
    @attr() factor;
    @attr() current;
    @attr() min;
    @attr() max;
    @attr() requirements;
}