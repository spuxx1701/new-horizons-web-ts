import EmberRouter from '@ember/routing/router';
import ENV from 'new-horizons-web/config/environment';

export default class Router extends EmberRouter {
  location = ENV.locationType;
  rootURL = ENV.rootURL;
}

Router.map(function () {
  this.route('main', { path: '' }, function () {
    this.route('home', { path: '' });
    this.route('news');
    this.route('support');
    this.route('imprint');
    this.route('sign-up');
    this.route('verify');
    //this.route('verify', { path: 'verify*' });
    this.route('settings');
    this.route('generator', function () {
      this.route('preset');
    });
    this.route('editor');
    this.route('stellarpedia', { path: '/stellarpedia/:fullEntryAdress' });
    this.route('page-not-found', { path: '/*' });
    this.route('sign-in');
  });
});
