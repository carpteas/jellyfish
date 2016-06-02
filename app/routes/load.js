'use strict';

var restify         = require('restify');

var file_manager    = require('app/models/file_manager.js');

module.exports = function(req, res, next) {
  file_manager.checkRandom(req.random, next, function(isExisting) {
    if (!isExisting) next.ifError(new restify.NotFoundError('file not found inside storage'));

    file_manager.readFile(req.username, req.random, req.key, next, res);
  });
};