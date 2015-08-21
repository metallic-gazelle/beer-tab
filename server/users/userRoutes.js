var userCtrl = require('./userController'),
	helpers = require('../config/helpers');

module.exports = function (app) {
  // app is the userRouter injected from middleware.js

  app.post('/login', userCtrl.login);
  app.post('/signup', userCtrl.signup);

  app.use('/table', helpers.decode);
  app.use('/tabs', helpers.decode);
  app.post('/table', userCtrl.getTable);
  app.post('/tabs', userCtrl.toTabs);
  app.get('/tabs', userCtrl.findAllUsers);
};
