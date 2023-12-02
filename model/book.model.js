const mongoose = require('mongoose');

module.exports = mongoose.model('Book',{
    title: String,
  rate: Number,
  img2:String,
  img1: String,
  img3: String,
  Pages: Number,
  Language: String,
  author: String,
  comments: Array,
  outOfStock: Boolean
});


