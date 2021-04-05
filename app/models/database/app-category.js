import Model, { attr } from '@ember-data/model';

export default class DatabaseAppCategoryModel extends Model {
    @attr() baseSkill;
}