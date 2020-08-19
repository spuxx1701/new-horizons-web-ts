//  Leopold Hock | 30.04.2020
//  Description: This helper fetches an entry's header and returns it without tags.

import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class StellarpediaGetEntryHeaderHelper extends Helper {
    @service stellarpediaService;
    compute([entry, ...rest]) {
        return this.stellarpediaService.getEntryHeader(entry);
    }
}