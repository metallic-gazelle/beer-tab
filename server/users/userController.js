var jwt = require('jwt-simple'),
    User = require('./userModel');

module.exports = {
    findAllUsers: function(req, res) {
        User.find({}, function(err, docs) {
            if (!err) {
                res.json(docs);
            } else {
                console.error(err);
            }
        });
    },

  signup: function (req, res, next) {
    // Look for fbToken already on request body, store reference if
    // it exists and delete before passing request body to be saved to dB
    if (!!req.body.token){
      var fbToken = req.body.token;
      delete req.body.token;
    }
    // Define displayname and username for attaching to returned FB token obj
    var displayname = req.body.name['first'];
    var username = req.body.username;

    User.findOne({username: req.body.username})
      .exec(function (err, user) {
        if (!user) {
          var newUser = new User(req.body);
          newUser.save(function (err, newUser) {
            if (err) {
              next(err);
            } else {
              // ***Look for fbToken first, fall back to jwt if not found
              var token = fbToken || jwt.encode(newUser, 'argleDavidBargleRosson');
              if (!!fbToken){
                res.json({token: token, fb: true, username: username, displayname: displayname});
              } else {
                res.json({token: token});
              }
              console.log('Success: Account added to database.');
              res.status(201).end();
            }
          });
        } else {
          res.status(401).end("Error: Account already exists");
        }
      });
  },

  login: function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    
    if (!!req.body.token){
      var fbToken = req.body.token;
      var displayname = req.body.name['first'];
      delete req.body.token;
    }

    // If FB token is present, don't try to validate password
    User.findOne({ username: username })
      .exec(function (err, user) {
        if (!user) {
          res.status(401).end("Username Not Found");
        } else if (!!fbToken) {
          res.json({token: fbToken, fb: true, username: username, displayname: displayname});
          console.log("Logged In With Facebook");
          res.status(201).end();
        } else {
          user.comparePassword(password, user.password, function (err, match) {
            if (match) {
              var token = jwt.encode(user, 'argleDavidBargleRosson');
              res.json({token: token});
              console.log('Success: Logged in');
              res.status(200).end();

            } else {
              res.status(401).end("Incorrect Password: Try Again");
            }
          });
        }
      });
  },


    getTable: function(req, res) {
        //Here we distribute the data we received from the request
        var username = req.body.username;
        //we need a temporal variable to use the update method on the db.
        //var temp;

        //This query finds the receiver in the db
        User.findOne({
                username: username
            })
            .exec(function(err, user) {
                if (!user) {
                    console.log('attempted to route to tabs, but person not found!');
                    res.status(500).end();
                } else {
                    res.status(201).send(user.network);
                }

            });
    },

    toTabs: function(req, res) {
        //Here we distribute the data we received from the request
        var receiver = req.body.user;
        //since we got a token we need to decode it first
        var decoded;
        try {
          decoded = JSON.parse(req.body.token);
        } catch (error) {
          decoded = jwt.decode(req.body.token, 'argleDavidBargleRosson');
        }
        var sender = decoded.username;
        //we need a temporal variable to use the update method on the db.
        var temp;
        //this ensures that a user is unale to owe to itself
        if (receiver === sender) {
            console.log('You can\'t owe yourself!');
            res.status(418).end();
        } else if (!receiver) { //this prevents the server from processing an undefined value
            console.log('Sending beer to undefined');
            res.status(500).end();
        } else {
            //This query finds the receiver in the db
            User.findOne({
                    username: receiver
                })
                .exec(function(err, user) {
                    if (!user) {
                        console.log('attempted to route to tabs, but person not found!');
                        res.status(500).end();
                    } else {
                        //if the receiver is on the network of the sender, the number is incremented
                        if (user.network.hasOwnProperty(sender)) {
                            user.network[sender]++;
                        } else {
                            //otherwise, we create the relationship
                            user.network[sender] = 1;
                        }
                        //here we assign the entire user object to teh temp variable
                        temp = user;
                        //We use the update method, here we replace the old
                        //network object, with the one insede temp
                        User.update({
                            _id: user._id
                        }, {
                            $set: {
                                network: temp.network
                            }
                        }, function(err) {
                            if (err) {
                                return err;
                            }
                        });
                        //this does the exact same thing, but from the sender's perspective
                        User.findOne({
                                username: sender
                            })
                            .exec(function(err, user) {
                                if (!user) {
                                    console.log('attempted to route to tabs, but person not found!');
                                    res.status(500).end();
                                } else {
                                    //instead of incrementing, the number decreases
                                    if (user.network.hasOwnProperty(receiver)) {
                                        user.network[receiver]--;
                                    } else {
                                        //the default in this case is negative
                                        user.network[receiver] = -1;
                                    }
                                    //here we assign the entire user object to teh temp variable
                                    temp = user;
                                    //We use the update method, here we replace the old
                                    //network object, with the one insede temp
                                    User.update({
                                        _id: user._id
                                    }, {
                                        $set: {
                                            network: temp.network
                                        }
                                    }, function(err) {
                                        if (err) {
                                            return err;
                                        }
                                    });
                                    //this sends the updated user to the client;
                                    res.status(201).send(user);
                                }

                            });
                    }
                });
        }
    }
};
