'use strict';

var jwt             = require('jsonwebtoken');
var restify         = require('restify');

var accounts        = require('app/facades/accounts.js');
var config          = require('config.js');

module.exports = function(req, res, next) {
  var token = req.headers['x-access-token'];

  if (!Boolean(token)) {
    next.ifError(new restify.UnauthorizedError('no token provided :('));
  }

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      next.ifError(new restify.ForbiddenError('failed to verify token :('));
    }

    accounts.read(decoded.username, next, function(user) {
      if (!user) {
        next.ifError(new restify.ForbiddenError('username no longer valid :('));
      }

      if (user.lastToken !== token) {
        next.ifError(new restify.ForbiddenError('token overridden and thus expired :('));
      }

      // req.log.trace(JSON.stringify(decoded));
      req.username = user.name;
      return next();
    });
  });
};