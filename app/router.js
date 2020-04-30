import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('login');
  this.route('registration');
  this.route('page-not-found');
  this.route('main', { path: '' }, function () {
    this.route('home');
    this.route('generator');
    this.route('editor');
    this.route('stellarpedia');
    this.route('settings');
  });
});
