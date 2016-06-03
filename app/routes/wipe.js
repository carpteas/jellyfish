'use strict';

var restify         = require('restify');

var assets     	    = require('app/facades/assets.js');

module.exports = function(req, res, next) {
  assets.exist(req.random, req.filename, req.fileext, next, function(isExisting) {
    if (!isExisting) next.ifError(new restify.BadRequestError('file not found to wipe out'));

    assets.delete(req.bucket, req.random, req.filename, req.fileext, req.key, next, res);
  });
};