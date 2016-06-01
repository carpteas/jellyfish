'use strict';

var restify         = require('restify');

var config          = require('config.js');
var util            = require('util.js');

module.exports = function(req, res, next) {
  req.username = 'yuyo';

  return next();
};