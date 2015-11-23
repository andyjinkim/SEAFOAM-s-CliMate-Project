var mongoose  = require('mongoose')
    ,Schema   = mongoose.Schema

var restaurantSchema = new Schema({
  name: String,
  location: String
})

// create a user model using mongoose.model. 'User' must match database name in server.js
var Restaurants = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurants
