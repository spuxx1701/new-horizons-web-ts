//  Leopold Hock | 30.04.2020
//  Description: This helper fetches a localized value from the LocalizationService.

import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class LocalizeHelper extends Helper {
  @service localizationService;
  compute([key, ...rest]) {
    return this.localizationService.getValue(key);
  }
}