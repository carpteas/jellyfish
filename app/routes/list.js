'use strict';

var File 			= require('app/models/file.js');

module.exports = function(req, res, next) {
  File.find({ username: req.username }, function(err, files) {
    return next(res.send(files));
  });
};