const mongoose = require('mongoose');

module.exports = mongoose.model('User',{
    name: String,
  username: {type: String, unique: true, required: true},
  password:{ type: String, required: true},
  address:String,
  phone:String,
  shopcart:Array,
  order: Array,
});
