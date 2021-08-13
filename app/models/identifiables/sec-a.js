import DatabasePrefabModel from './prefab';
import { attr } from '@ember-data/model';

export default class DatabaseSecAModel extends DatabasePrefabModel {
    @attr() current;
    @attr() bonus;
    @attr() primaryAttributes;
    @attr() div;
}