var drinkCtrl = require('./drinkController'),
  helpers = require('../config/helpers');

module.exports = function (app) {
  // app is the drinkRouter is injected from middleware.js

  // grab the user from the request
  app.use('/give', helpers.decode);
  app.post('/give', drinkCtrl.give);
};