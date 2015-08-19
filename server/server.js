// server.js -- initialize node.js server
// ----------------------------------------------
var express  = require('express'),
	mongoose = require('mongoose'),
	User = require('./users/userModel');

var app = express();

// connect to mongo db name beer-tap-db
mongoose.connect('mongodb://localhost:27017/beer-tab-db');

// populate the databse with some users
// remove this and the User require later
var user1 = new User({
  username: 'iemanatemire',
  password: 'argleBargle1',
  name: {
    first: 'Joe',
    last: 'Smith'
  },
  network: {'stvnwu': -1, 'Vandres': 2, 'mKurrel': 0, 'dRosson': 3}
});

var user2 = new User({
  username: 'stvnwu',
  password: 'argleBargle2',
  name: {
    first: 'Steven',
    last: 'Wu'
  },
  network: {'iemanatemire': 1, 'Vandres': 0, 'mKurrel': 2, 'dRosson': -3}
});

var user3 = new User({
  username: 'Vandres',
  password: 'argleBargle3',
  name: {
    first: 'Andres',
    last: 'V.'
  },
  network: {'stvnwu': 0, 'iemanatemire': -2, 'mKurrel': 1, 'dRosson': 0}
});

var user4 = new User({
  username: 'mKurrel',
  password: 'argleBargle4',
  name: {
    first: 'Michael',
    last: 'Kurrels'
  },
  network: {'stvnwu': -2, 'Vandres': -1, 'iemanatemire': 0, 'dRosson': 3}
});

var user5 = new User({
  username: 'dRosson',
  password: 'argleBargle5',
  name: {
    first: 'David',
    last: 'Rosson'
  },
  network: {'stvnwu': 3, 'Vandres': 0, 'mKurrel': -3, 'iemanatemire': -3, 'allenJPrice': -1}
});

var user6 = new User({
  username: 'allenJPrice',
  password: 'argleBargle6',
  name: {
    first: 'Allen',
    last: 'Price'
  },
  network: {'dRosson': 1}
});

user1.save(function (err, newUser) {
  if (err) {console.log('user already in DB'); }
  else {console.log('successfully added'); }
});
user2.save(function (err, newUser) {
  if (err) {console.log('user already in DB'); }
  else {console.log('successfully added'); }
});
user3.save(function (err, newUser) {
  if (err) {console.log('user already in DB'); }
  else {console.log('successfully added'); }
});
user4.save(function (err, newUser) {
  if (err) {console.log('user already in DB'); }
  else {console.log('successfully added'); }
});
user5.save(function (err, newUser) {
  if (err) {console.log('user already in DB'); }
  else {console.log('successfully added'); }
});
user6.save(function (err, newUser) {
  if (err) {console.log('user already in DB'); }
  else {console.log('successfully added'); }
});


// configure the server with all the middleware and the routing
require('./config/middleware.js')(app, express);

var port = 3000;

app.listen(port);

console.log('Beer-tab server listening on port ' + port);

module.exports = app;