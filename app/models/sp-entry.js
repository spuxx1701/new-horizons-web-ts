import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import Fragment from 'ember-data-model-fragments/fragment';
import { fragment, fragmentArray, array } from 'ember-data-model-fragments/attributes';

export default class StellarpediaEntryFragment extends Fragment {
    @attr("string") key;
    @array("string") elements;
}

/*export default class StellarpediaEntryModel extends Model {
    @belongsTo("sp-chapter") chapter;
    @hasMany("sp-element") elements;
}*/