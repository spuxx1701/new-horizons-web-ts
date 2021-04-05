import Model, { attr } from '@ember-data/model';

export default class DatabaseSkillModel extends Model {
    @attr() skillCategory;
    @attr() factor;
    @attr() constraint;
    @attr() current;
    @attr() min;
    @attr() max;
    @attr() primaryAttributes;
    @attr() hasSpecialisations;
    @attr() isBasic;
    @attr() baseValue;
    @attr() requirements;
    @attr() specialExperience;
}