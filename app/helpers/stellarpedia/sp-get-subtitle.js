//----------------------------------------------------------------------------//
// Leopold Hock / 2020-08-26
// Description:
// This helper returns an image's subtitle.
//----------------------------------------------------------------------------//

import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class StellarpediaGetEntryHeaderHelper extends Helper {
    @service stellarpediaService;
    compute([element, ...rest]) {
        return this.stellarpediaService.getImageSubtitle(element);
    }
}