import JSONAPIAdapter from '@ember-data/adapter/json-api';
import ENV from 'new-horizons-web/config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {

    host = ENV.APP.apiUrl;
    namespace = ENV.APP.apiNamespace;
}