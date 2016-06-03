'use strict';

var jwt             = require('jsonwebtoken');
var restify         = require('restify');

var accounts        = require('app/facades/accounts.js');
var config          = require('config.js');
var util            = require('util.js');

module.exports = function(req, res, next) {
  if (!Boolean(req.params['username']) || !Boolean(req.params['password'])) {
    next.ifError(new restify.BadRequestError('missing either username or password'));
  }

  accounts.read(req.params['username'], next, function(user) {
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
        next.ifError(new restify.InternalServerError('failed while generating token'));
      }

      user.lastToken = token;
      user.lastVisit = new Date;

      accounts.update(user, next, function() {
        req.log.info('[%s]\'s lastVisit = %s', user.name, user.lastVisit);
        return next(res.send({
          success: true,
          message: 'enjoy tokenizing :)',
          token: token
        }));
      });
    });
  });
};