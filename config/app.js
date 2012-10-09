
/**
 * Load dependencies.
 */


const express       = require('express'),
      mongoose      = require('mongoose'),
      models        = require('./models'),
      config        = require('./config'),
      routes        = require('./routes'),
      environments  = require('./environments'),
      errors        = require('./errors');


/**
 * Exports
 */

module.exports = function() {

  const app = express.createServer();

  models(app);

  config(app);

  environments(app);

  routes(app);

  errors(app);

  return app;

};
