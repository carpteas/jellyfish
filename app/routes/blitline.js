'use strict';

var util            = require('util.js');

module.exports = function(req, res, next) {
  util.backwss.emit('blitline', req.params['results']);

  return next();
};