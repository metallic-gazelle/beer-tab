var Drink = require('./drinkModel');
var User = require('./userModel');

module.exports = {

  give: function (req, res, next) {

    var drink = new Drink({
      drink: req.body.drink,
      cost: req.body.cost,
      username: req.body.username
    });
    drink.save(function (err, newDrink) {
      if (err) { next(err); }
      else {
        // add owed drink to the user who received it (username in row of client table)
        User.findOne({username: req.body.username})
          .exec(function (err, user) {
            if (err) { next(err); }
            user.owed.push(newDrink._id);
            user.save(function (err, user) {
              if (err) { next(err); }
            });
          });

        // add bought drink to user who sent the drink
        User.findOne({username: req.user.username })
          .exec(function (err, buyer) {
            if (err) { next(err); }
            buyer.bought.push(newDrink._id);
            buyer.save(function (err, buyer) {
              if (err) { next(err); }
            });
          });
      }
    });
  },

};
