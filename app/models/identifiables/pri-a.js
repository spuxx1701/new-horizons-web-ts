import DatabasePrefabModel from './prefab';
import { attr } from '@ember-data/model';

export default class DatabasePriAModel extends DatabasePrefabModel {
    @attr() current;
    @attr() start;
    @attr() min;
    @attr() max;
}