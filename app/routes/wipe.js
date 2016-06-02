'use strict';

var restify         = require('restify');

var file_manager    = require('app/models/file_manager.js');

module.exports = function(req, res, next) {
  file_manager.isExisting(req.random, req.filename, req.fileext, next, function(isExisting) {
    if (!isExisting) next.ifError(new restify.BadRequestError('file not found to wipe out'));

    file_manager.deleteFile(req.username, req.random, req.key, next, res);
  });
};