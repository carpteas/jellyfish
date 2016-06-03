'use strict';

var assets     	    = require('app/facades/assets.js');

module.exports = function(req, res, next) {
  assets.search({ username: req.username }, next, res);
};