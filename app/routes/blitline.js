'use strict';

var restify         = require('restify');

var util            = require('util.js');

module.exports = function(req, res, next) {
util.emitter.emit('audit', req.body.results);
util.emitter.emit('audit', req.params['results']);
return next(res.send({ success: true }));
/*
  try {
    var result = JSON.parse(req.body).results;
    if (!Boolean(result) || !Boolean(result.job_id)) throw new Error('syntax bad');

    if (!Boolean(result.errors)) {
      util.emitter.emit('success', result.job_id);
    } else {
      util.emitter.emit('failure', { job: result.job_id, reason: result.errors[0] });
    }

    return next(res.send({ success: true }));
  } catch (err) {
    next.ifError(new restify.BadRequestError('request body invalid'));
  }
*/
};