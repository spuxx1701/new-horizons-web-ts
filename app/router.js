import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('main', { path: '' }, function () {
    this.route('home', { path: '' });
    this.route('news');
    this.route('support');
    this.route('imprint');
    this.route('sign-up');
    this.route('settings');
    this.route('app-log');
    this.route('generator', function () {
      this.route('preset');
    });
    this.route('editor');
    this.route('stellarpedia', { path: '/stellarpedia/:fullEntryAdress' });
    this.route('page-not-found', { path: '/*' });
  });
});
