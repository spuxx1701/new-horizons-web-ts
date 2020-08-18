import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import Fragment from 'ember-data-model-fragments/fragment';
import { fragment, fragmentArray, array } from 'ember-data-model-fragments/attributes';

export default class StellarpediaChapterFragment extends Fragment {
    @fragment("stellarpedia") book;
    @attr("string") key;
    @attr("string") header;
    @attr("boolean") sortEntriesByLocalization;
    @fragmentArray("sp-entry") entries;
}

/*export default class StellarpediaChapterModel extends Model {
    @belongsTo("stellarpedia") book;
    @attr("string") header;
    @attr("boolean") sortEntriesByLocalization;
    @hasMany("sp-entry") entries;
}*/