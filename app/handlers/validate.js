'use strict';

var restify         = require('restify');

var util            = require('util.js');

module.exports = function(req, res, next) {
  // regex: /^\/([\w\.~-]+)\/([\w\.~-]+)\/(.*)/
  if (req.params[2] !== '') {
    var subs = req.params[2].split('\/');
    subs.forEach(function(sub) {
      if (!Boolean(sub)) next.ifError(new restify.BadRequestError("bad directory url :("));
    })
  }

  // e.g. /jellyfish/app/handlers or /
  req.filepath = '/' + req.params[2];
  // e.g. validate
  req.filename = req.params[1];
  // e.g. js
  req.fileext = req.params[0];

  req.bucket = util.getBucket(req.username);
  req.log.info('BUCKET: %s', req.bucket);
  req.random = util.getRandom(req.filepath, req.username);
  req.log.info('RANDOM: %s', req.random);
  req.key = util.getKey(req.filename, req.fileext);
  req.log.info('TARGET: %s', req.username + ':' + req.filepath + (req.filepath === '/' ? '' : '/') + req.key);

  return next();
};