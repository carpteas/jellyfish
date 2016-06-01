'use strict';

var mongoose 		= require('mongoose');

var Schema = mongoose.Schema;
module.exports = mongoose.model('File', new Schema({
  randomness: String,
  username: String,
  path: String,
  name: String,
  ext: String,
  firstStore: { type: Date, default: new Date },
  lastUpdate: Date
}));