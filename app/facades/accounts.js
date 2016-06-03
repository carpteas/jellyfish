'use strict';

var restify         = require('restify');

var User            = require('app/models/user.js');
var config          = require('config.js');
var util            = require('util.js');

module.exports.create = function(name, pass, next, res) {
  var one = new User({
    name: name
  });

  one.password = util.hash(pass, one._id.toString());
  one.save(function(err) {
    if (err) {
      util.logger.error(err, 'failed on User.save()');
      next.ifError(new restify.InternalServerError('failed while saving to database'));
    }

    util.s3.createBucket({Bucket: util.getBucket(one.name)}, function(err) {
      if (err) {
        util.logger.error(err, 'failed on S3.createBucket()');
        next.ifError(new restify.InternalServerError('failed while creating S3 object'));
      }

      return next(res.send({ success: true }));
    });
  });
};

module.exports.read = function(name, next, callback) {
  User.findOne({ name: name }, function(err, user) {
    if (err) {
      util.logger.error(err, 'failed on User.findOne()');
      next.ifError(new restify.InternalServerError('failed while reading from database'));
    }

    callback(user);
  });
};

module.exports.update = function(user, next, callback) {
  user.save(function(err) {
    if (err) {
      util.logger.error(err, 'failed on User.save()');
      next.ifError(new restify.InternalServerError('failed while saving to database'));
    }

    callback();
  });
};

module.exports.exist = function(name, next, callback) {
  User.count({ name: name }, function(err, count) {
    if (err) {
      util.logger.error(err, 'failed on User.count()');
      next.ifError(new restify.InternalServerError('failed while reading from database'));
    }

    callback(count !== 0);
  });
};

module.exports.search = function(criteria, next, res) {
  User.find(criteria, function(err, users) {
    return next(res.send(users));
  });
};