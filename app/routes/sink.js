'use strict';

var file_manager 	= require('app/models/file_manager.js');

module.exports = function(req, res, next) {
  file_manager.isExisting(req.random, req.filename, req.fileext, next, function(isExisting) {
    if (!isExisting) {
      file_manager.createFile(req.random, req.username, req.filepath, req.filename, req.fileext, next, function() {
        file_manager.signOperation('putObject', req.username, req.random, req.key, next, res);
      });
    } else {
      req.log.warn('[%s]/%s.%s already exists, UPDATE instead of CREATE', req.random, req.filename, req.fileext);

      file_manager.updateFile(req.random, req.filename, req.fileext, next, function() {
        file_manager.signOperation('putObject', req.username, req.random, req.key, next, res);
      });
    }
  });
};