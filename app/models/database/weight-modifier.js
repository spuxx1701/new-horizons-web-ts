import Model, { attr } from '@ember-data/model';

export default class DatabaseWeightModifierModel extends Model {
    @attr() value;
}