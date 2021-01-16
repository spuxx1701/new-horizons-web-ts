import JSONAPIAdapter from '@ember-data/adapter/json-api';
//import config from '../config/environment';
//import environment from '../../config/environment';

export default class ApplicationAdapter extends JSONAPIAdapter {

    //host = config.environment.APP.apiUrl;
    host = "http://laravel.newhorizons";
    //namespace = config.environment.APP.apiNamespace;
    namespace = "api/v1";

}