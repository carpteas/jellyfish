'use strict';

var mongoose        = require('mongoose');

var Schema = mongoose.Schema;
module.exports = mongoose.model('User', new Schema({
  name: String,
  password: String,
  lastToken: String,
  lastVisit: Date
}));