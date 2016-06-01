'use strict';

var restify         = require('restify');

var file_manager 	= require('app/models/file_manager.js');

module.exports = function(req, res, next) {
  file_manager.checkRandom(req.random, next, function(isExisting) {
    if (!isExisting) return next(new restify.BadRequestError('file not found to wipe out'));

    file_manager.deleteFile(req.random, req.key, next, res);
  });
};