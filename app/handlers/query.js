'use strict';

var restify         = require('restify');

var config          = require('config.js');
var util            = require('util.js');

module.exports = function(req, res, next) {
  if (!Boolean(req.query.u)) {
    next.ifError(new restify.BadRequestError('missing mandatory info'));
  }

  req.username = req.query.u;
  req.extrargs = req.query.x;

  return next();
};