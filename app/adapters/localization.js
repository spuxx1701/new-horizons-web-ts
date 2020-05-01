import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { inject as service } from '@ember/service';

export default class LocalizationAdapter extends JSONAPIAdapter {
  /*@service localizationService;
  var hostPrefix = "/assets/localization/localization_";
  namespace = 'api/v1';
  get host() {
    return hostPrefix + this.localizationService.currentLocalization;
  }*/
}