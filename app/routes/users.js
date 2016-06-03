'use strict';

var accounts        = require('app/facades/accounts.js');

module.exports = function(req, res, next) {
  accounts.search({}, next, res);
};