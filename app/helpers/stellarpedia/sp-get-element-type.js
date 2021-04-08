//  Leopold Hock | 30.04.2020
//  Description: This helper fetches an element's type and returns it.

import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class StellarpediaGetElementTypeHelper extends Helper {
    @service stellarpediaService;
    compute([element, bookId = "", chapterId = "", entryId = "", ...rest]) {
        return this.stellarpediaService.getElementType(element, bookId, chapterId, entryId);
    }
}