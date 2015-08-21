var mongoose = require('mongoose');

// Define drink schema
var DrinkSchema = new mongoose.Schema({
  drink: String,
  cost: Number,
  username: String
});
