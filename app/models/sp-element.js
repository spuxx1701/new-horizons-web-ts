import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import Fragment from 'ember-data-model-fragments/fragment';
import { fragment, fragmentArray, array } from 'ember-data-model-fragments/attributes';

export default class StellarpediaElementFragment extends Fragment {
    @attr("string") element;
}

/*export default class StellarpediaElementModel extends Model {
    @belongsTo("sp-entry") entry;
    @attr("string") element;
}*/