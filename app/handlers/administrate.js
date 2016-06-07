'use strict';

var restify         = require('restify');

var config          = require('config.js');

module.exports = function(req, res, next) {
  var awsAccess = req.headers['x-access-username'];
  var awsSecret = req.headers['x-access-password'];

  if (!Boolean(awsAccess) || !Boolean(awsSecret)) {
    next.ifError(new restify.BadRequestError('missing administrative rights'));
  }

  if (awsAccess !== (process.env.AWS_ACCESS || config.awsAccess) ||
      awsSecret !== (process.env.AWS_SECRET || config.awsSecret)) {
    next.ifError(new restify.ForbiddenError('not allowed, you bastard'));
  }

  return next();
};