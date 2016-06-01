'use strict';

var restify         = require('restify');

var config          = require('config.js');

module.exports = function(req, res, next) {
  var awsAccess = req.headers['x-access-username'];
  var awsSecret = req.headers['x-access-password'];

  if (!Boolean(awsAccess) || !Boolean(awsSecret)) {
    return next(new restify.BadRequestError('missing either username or password'));
  }

  if (awsAccess !== config.awsAccess || awsSecret !== config.awsSecret) {
    return next(new restify.ForbiddenError('not allowed, you bastard'));
  }

  return next();
};