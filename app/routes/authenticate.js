'use strict';

var jwt             = require('jsonwebtoken');
var restify         = require('restify');

var User            = require('app/models/user.js');
var config          = require('config.js');
var util            = require('util.js');

module.exports = function(req, res, next) {
  if (!Boolean(req.params['username']) || !Boolean(req.params['password'])) {
    return next(new restify.errors.BadRequestError('missing either username or password'));
  }

  User.findOne({ name: req.params['username'] }, function(err, user) {
    if (err) {
      req.log.error(err, 'failed on User.findOne()');
      return next(new restify.errors.InternalServerError('failed while reading from database'));
    }

    if (!user) {
      return next(res.send({ success: false, message: 'authentication failed: username not found!' }));
    }

    if (user.password !== util.hash(req.params['password'], user._id.toString())) {
      return next(res.send({ success: false, message: 'authentication failed: wrong password!' }));
    }

    // JSON.stringify(user) yields "Converting circular structure to JSON" due to Date within User
    jwt.sign({ username: user.name, password: user.password }, config.secret, {
      algorithm: config.algorithm,
      expiresIn: config.expiresIn
    }, function(err, token) {
      if (err) {
        req.log.error(err, 'failed on jwt.sign(): %s', 'user');
        return next(new restify.errors.InternalServerError('failed while generating token'));
      }

      user.lastToken = token;
      user.lastVisit = new Date;
      user.save(function(err) {
        if (err) {
          req.log.error(err, 'failed on User.save()');
          return next(new restify.errors.InternalServerError('failed while saving to database'));
        }

        req.log.trace('[%s]\'s lastVisit = %s', user.name, user.lastVisit);
        return next(res.send({
          success: true,
          message: 'enjoy tokenizing :)',
          token: token
        }));
      });
    });
  });
};