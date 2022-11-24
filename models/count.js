// models/Count.js

var mongoose = require('mongoose');

// schema
var countSchema = mongoose.Schema({
  name:{type:String, required:true},
  cnt:{type:Number, default:0},
});

// model & export
var Count = mongoose.model('count', countSchema);
module.exports = Count;