'use strict';

var restify         = require('restify');

var util            = require('util.js');

module.exports = function(req, res, next) {
  try {
    var results = JSON.parse(req.params['results']);
    if (!Boolean(results.job_id)) throw new Error('job_id missing');

    if (!Boolean(results.errors)) {
      util.emitter.emit('success', results.job_id);
    } else {
      util.emitter.emit('failure', { job: results.job_id, reason: results.errors[0] });
    }

    return next(res.send({ success: true }));
  } catch (err) {
    next.ifError(new restify.BadRequestError('request body invalid'));
  }
};