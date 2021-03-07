import EmberRouter from '@ember/routing/router';
import ENV from 'new-horizons-web/config/environment';

export default class Router extends EmberRouter {
  location = ENV.locationType;
  rootURL = ENV.rootURL;
}

Router.map(function () {
  this.route('main', { path: '' }, function () {
    // Flat routes on the main level for general functionality
    this.route('home', { path: '' });
    this.route('news');
    this.route('support');
    this.route('imprint');
    this.route('sign-up');
    this.route('sign-in');
    this.route('settings');
    // The 'request' route holds any routes that are served only to send small requests to the backend
    this.route('request', function () {
      this.route('verify');
      this.route('reset-password');
    });
    // The Stellarpedia
    this.route('stellarpedia', { path: '/stellarpedia/:fullEntryAdress' });
    // The charakter generator
    this.route('generator', function () {
      this.route('preset');
    });
    // The character editor
    this.route('editor');
    this.route('page-not-found', { path: '/*' });
  });
});
