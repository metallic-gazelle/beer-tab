var bodyParser = require('body-parser');
var request = require('request');
var jwt = require('jwt-simple');

var User = require('./db-config.js');

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .exec(function(err, user) {
      if (!user) {
        var newUser = new User({
          username: username,
          password: password
        });

        newUser.save(function(err, newUser) {
          if (err) {
            res.status(418).end();
          } else {
            var token = jwt.encode(user, 'argleDavidBargleRosson');
            res.json({token: token});
            console.log('Success: Account added to database.');
            res.status(201).end();
          }
        });
      } else {
        console.log('Error: Account already exists');
        res.status(418).end();
      }
    });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({ username: username })
    .exec(function(err, user) {

      if (!user) {
        res.status(418).end();
      } else {
        var savedPassword = user.password;
        user.comparePassword(password, savedPassword, function(err, match) {
          if (match) {
            var token = jwt.encode(user, 'argleDavidBargleRosson');
            res.json({token: token});
            console.log('Success: Logged in');
            res.status(201).end();

          } else {
            console.log('Error: Incorrect password');
            res.status(418).end();
          }
        });
      }
  });
};


exports.toTabs = function(req, res){
  //Here we distribute the data we received from the request
  var reciever = req.body.user;
  //since we got a token we need to decode it first
  var decoded = jwt.decode(req.body.token, 'argleDavidBargleRosson');
  var sender = decoded.username;
  var temp;
  //This query finds the sender in the db
  User.findOne({ username: sender })
    .exec(function(err, user) {
      if(!user) {
        console.log('attempted to route to tabs, but person not found!');
        res.status(500).end();
      } else {

              console.log('orignal', user.network)
              // if user exists, check the session's username
              // var token = jwt.encode(user, 'argleDavidBargleRosson');
              // var decoded = jwt.decode(token, 'argleDavidBargleRosson');


          //if the receiver is on the network of the sender, the number is incremented 
          if(user.network.hasOwnProperty(reciever)){
            user.network[reciever]++;
            temp = user;

          } else {
            //otherwise, we create the relationship
            user.network[reciever] = 1;
            temp = user;
          }
          console.log('mod1', user.network) 
          User.update({_id: user._id}, {$set: {network: temp.network}}, function(err){
            if (err) return err;
          });

          //this does the exact same thing, but from the receiver's perspective  
          User.findOne({ username: reciever })
            .exec(function(err, user) {
              if(!user) {
                console.log('attempted to route to tabs, but person not found!');
                res.status(500).end();
              } else {
                console.log('orignal2', user.network)
                  //instead of incrementing, the number decreases
                  if(user.network.hasOwnProperty(sender)){
                    user.network[sender]--;
                    temp = user;
                  } else {
                    //the default in this case is negative
                    user.network[sender] = -1;
                    temp = user;
                  }
                  console.log('mod2', user.network)

                  User.update({_id: user._id}, {$set: {network: temp.network}}, function(err){
                    if (err) return err;
                  });

                  res.status(201).send(user).end();
                }
            });  
        }
    });


};

exports.toPaid = function(req, res){
   //Here we distribute the data we received from the request
  var sender = req.body.user;
   //since we got a token we need to decode it first
  var decoded = jwt.decode(req.body.token, 'argleDavidBargleRosson');
  var receiver = decoded.username;
  //This query finds the sender in the db
  User.findOne({ username: sender }) 
    .exec(function(err, user){
      if(!user){
        console.log('attempted to route to paid, but person not found!');
        res.status(500).end();  
      } else {
          if (!user.network[receiver]) {
            console.log('attempted to route to paid, but person not found!');
            res.status(500).end();
          } else {
            user.network[receiver]--;
            //This query finds the receiver in the db
            User.findOne({username: receiver})
              .exec(function(err, user) {
                if(err){
                  res.status(500).end();
                } else {
                  if(user){
                    user.network[sender]++;
                    res.status(201).send(user).end();
                  } 
                }

              });
          } 
        
        // res.status(201).send(user).end();
      }
    });
};


