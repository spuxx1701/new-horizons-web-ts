import Model, { attr } from '@ember-data/model';

export default class DatabaseConstantModel extends Model {
    @attr() value;
}