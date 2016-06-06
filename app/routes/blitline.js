'use strict';

var restify         = require('restify');

var util            = require('util.js');

module.exports = function(req, res, next) {
  try {
    var json = JSON.parse(req.params['results']);
    if (!Boolean(json.job_id)) throw new Error('id missing');

    if (!Boolean(json.errors)) {
      util.emitter.emit('success', json.job_id);
    } else {
      util.emitter.emit('failure', { job: json.job_id, reason: json.errors[0] });
    }

    return next(res.send({ success: true }));
  } catch (err) {
    next.ifError(new restify.BadRequestError('request body invalid'));
  }
};