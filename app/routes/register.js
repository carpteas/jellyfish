'use strict';

var restify         = require('restify');

var User            = require('app/models/user.js');
var util            = require('util.js');

module.exports = function(req, res, next) {
  if (!Boolean(req.params['username']) || !Boolean(req.params['password'])) {
  	return next(new restify.BadRequestError('missing either username or password'));
  }

  var one = new User({
    name: req.params['username']
  });

  one.password = util.hash(req.params['password'], one._id.toString());
  one.save(function(err) {
    if (err) {
      req.log.error(err, 'failed on User.save()');
      return next(new restify.InternalServerError('failed while saving to database'));
    }

    return next(res.send({ success: true }));
  });
};