'use strict';

var assets          = require('app/facades/assets.js');

module.exports = function(req, res, next) {
  assets.exist(req.random, req.filename, req.fileext, next, function(isExisting) {
    if (!isExisting) {
      assets.create(req.random, req.username, req.filepath, req.filename, req.fileext, next, function() {
        assets.sign('putObject', req.bucket, req.random, req.key, next, res);
      });
    } else {
      req.log.warn('[%s]/%s.%s already exists, UPDATE instead of CREATE', req.random, req.filename, req.fileext);

      assets.update(req.random, req.filename, req.fileext, next, function() {
        assets.sign('putObject', req.bucket, req.random, req.key, next, res);
      });
    }
  });
};