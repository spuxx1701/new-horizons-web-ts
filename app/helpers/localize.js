//  Leopold Hock | 30.04.2020
//  Description: This helper fetches a localized value from the LocalizationService.

import Helper from '@ember/component/helper';
import { inject as service } from '@ember/service';

export default class Substring extends Helper {
  @service localizationService;
  compute([key, ...rest]) {
    return this.localizationService.getValue(key);
  }
}


/*export default class extends Helper {
  @service localizationService;
  compute([key, ...rest]) {
    return this.localizationService.getValue(key);
  }
}*/
/*
export function localize([key, ...rest]) {
    //return Ember.getOwner(this).lookup('service:localizationService');
    var locService = Ember.getOwner(this).lookup('service:localizationService');
    return locService.getValue(key);
  }

export default helper(localize);*/