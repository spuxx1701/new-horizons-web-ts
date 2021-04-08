import Model, { attr } from '@ember-data/model';

export default class DatabaseOriginModel extends Model {
    @attr() convenientTraits;
    @attr() specialPA;
    @attr() skillsFixed;
    @attr() skillOptions;
}