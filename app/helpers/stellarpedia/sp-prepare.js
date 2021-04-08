//  Leopold Hock | 30.04.2020
//  Description: This helper processes a Stellarpedia element depending on its type.

import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';

export default class StellarpediaPrepareHelper extends Helper {
    @service stellarpediaService;
    compute([element, ...rest]) {
        let result = this.stellarpediaService.prepareElement(element);
        // mark string as html-safe
        result = htmlSafe(result);
        return result;
    }
}