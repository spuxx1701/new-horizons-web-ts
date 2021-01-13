'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'new-horizons-web',
    environment,
    rootURL: '/',
    locationType: 'auto',
    contentSecurityPolicy: {
      'default-src': "'none'",
      'script-src': "'self' 'liveReloadPort' 'unsafe-inline' 'unsafe-eval'",
      'font-src': "'self'",
      'connect-src': "'self' 'liveReloadPort' 'localhost'",
      'img-src': "'self'",
      'style-src': "'self' 'unsafe-inline'"
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      apiUrl: "/api/",
      apiSuffix: "",
      stellarpediaUrl: "/assets/stellarpedia/"
    }
  };

  if (environment === 'development') {
    ENV.APP.apiUrl = "http://localhost:8000/api/";//"https://www.new-horizons-game.com/api/";"https://localhost:80/new-horizons-web-api/"
    ENV.APP.apiSuffix = ".php";
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    ENV.contentSecurityPolicy = {
      'default-src': "'self'",
      'script-src': "'self'",
      'font-src': "'self'",
      'connect-src': "'self'",
      'img-src': "'self'",
      'style-src': "'self'",
      'media-src': "'self'"
    };
  }

  return ENV;
};
