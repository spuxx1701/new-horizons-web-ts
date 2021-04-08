import Model, { attr } from '@ember-data/model';

export default class DatabaseSkillCategoryModel extends Model {
    @attr() available;
    @attr() total;
    @attr() min;
    @attr() max;
    @attr() numberOfSkills;
    @attr() maxNumberOfSkills;
}