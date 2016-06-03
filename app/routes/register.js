'use strict';

var restify         = require('restify');

var accounts        = require('app/facades/accounts.js');

module.exports = function(req, res, next) {
  if (!Boolean(req.params['username']) || !Boolean(req.params['password'])) {
  	next.ifError(new restify.BadRequestError('missing either username or password'));
  }

  accounts.create(req.params['username'], req.params['password'], next, res);
};