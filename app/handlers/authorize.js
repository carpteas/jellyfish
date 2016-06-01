'use strict';

var jwt             = require('jsonwebtoken');
var restify         = require('restify');

var User            = require('app/models/user.js');
var config          = require('config.js');

module.exports = function(req, res, next) {
  var token = req.headers['x-access-token'];

  if (!token) {
    return next(new restify.UnauthorizedError('no token provided :('));
  }

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) {
      return next(new restify.ForbiddenError('failed to verify token :('));
    }

    User.findOne({ name: decoded.username }, function(err, user) {
      if (err) {
        req.log.error(err, 'failed on User.findOne()');
        return next(new restify.InternalServerError('failed while reading from database'));
      }

      if (!user) {
        return next(new restify.ForbiddenError('username no longer valid :('));
      }

      if (user.lastToken !== token) {
        return next(new restify.ForbiddenError('token overridden and thus expired :('));
      }

      req.log.trace(JSON.stringify(decoded));
      req.username = user.name;
      return next();
    });
  });
};