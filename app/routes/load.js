'use strict';

var restify         = require('restify');

var assets     	    = require('app/facades/assets.js');

module.exports = function(req, res, next) {
  assets.exist(req.random, req.filename, req.fileext, next, function(isExisting) {
    if (!isExisting) next.ifError(new restify.NotFoundError('file not found inside storage'));

    if (!Boolean(req.extrargs)) assets.read(req.bucket, req.random, req.key, next, res);
    else assets.transform(req.bucket, req.random, req.key, req.extrargs, next, res);
  });
};