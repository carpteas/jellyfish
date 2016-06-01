'use strict';

var restify         = require('restify');

var config          = require('/config');
var util            = require('/util');

module.exports = function(req, res, next) {
  // config.pathRegex === /^\/([\w\.~-]+)\/([\w\.~-]+)\/(.*)/
  if (req.params[2] !== '') {
    var subs = req.params[2].split('\/');
    subs.forEach(function(sub) {
      if (!Boolean(sub)) return next(new restify.BadRequestError("bad directory url :("));
    })
  }

  // e.g. /jellyfish/app/handlers or /
  req.filepath = '/' + req.params[2];
  // e.g. validate
  req.filename = req.params[1];
  // e.g. js
  req.fileext = req.params[0];

  req.destination = req.username + ':' +
                    req.filepath + (req.filepath === '/' ? '' : '/') +
                    req.filename + '.' + req.fileext;
  req.log.info('%s', req.destination);

  req.random = util.hash(req.destination, config.s3Bucket);
  req.key = req.filename + '.' + req.fileext;

  return next();
};