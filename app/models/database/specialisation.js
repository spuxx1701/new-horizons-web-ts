import Model, { attr } from '@ember-data/model';

export default class DatabaseSpecialisationModel extends Model {
    @attr() skill;
}