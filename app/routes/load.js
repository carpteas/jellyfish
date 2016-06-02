'use strict';

var restify         = require('restify');

var file_manager    = require('app/models/file_manager.js');

module.exports = function(req, res, next) {
  file_manager.isExisting(req.random, req.filename, req.fileext, next, function(isExisting) {
    if (!isExisting) next.ifError(new restify.NotFoundError('file not found inside storage'));

    file_manager.readFile(req.bucket, req.random, req.key, next, res);
  });
};