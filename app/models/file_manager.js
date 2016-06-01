'use strict';

var restify         = require('restify');

var File            = require('app/models/file.js');
var config          = require('config.js');
var util            = require('util.js');

module.exports.checkRandom = function(random, next, callback) {
  File.count({ randomness: random }, function(err, count) {
    if (err) {
      util.logger.error(err, 'failed on File.count()');
      return next(new restify.errors.InternalServerError('failed while reading from database'));
    }

    callback(count !== 0);
  });
};

module.exports.createFile = function(random, username, path, name, ext, next, callback) {
  var one = new File({
    randomness: random,
    username: username,
    path: path,
    name: name,
    ext: ext
  });

  one.save(function(err) {
    if (err) {
      util.logger.error(err, 'failed on File.save()');
      return next(new restify.errors.InternalServerError('failed while saving to database'));
    }

    callback();
  });
};

module.exports.updateFile = function(random, next, callback) {
  File.findOne({ randomness: random }, function(err, file) {
    if (err) {
      util.logger.error(err, 'failed on File.findOne()');
      return next(new restify.errors.InternalServerError('failed while reading from database'));
    }

    file.lastUpdate = new Date;
    file.save(function(err) {
      if (err) {
        util.logger.error(err, 'failed on File.save()');
        return next(new restify.errors.InternalServerError('failed while saving to database'));
      }

      callback();
    });
  });
};

module.exports.deleteFile = function(random, key, next, res) {
  File.remove({ randomness: random }, function(err, file) {
    if (err) {
      util.logger.error(err, 'failed on File.remove()');
      return next(new restify.errors.InternalServerError('failed while saving to database'));
    }

    util.s3.deleteObjects({
      Bucket: config.s3Bucket,
      Delete: { Objects: [{ Key: random + '/' + key }, { Key: random }] }
    }, function(err, data) {
        if (err) {
          util.logger.error(err, 'failed on S3.deleteObjects()');
          return next(new restify.errors.InternalServerError('failed while deleting S3 objects'));
        }

        return next(res.send({ success: true }));
    });
  });
};

module.exports.signOperation = function(type, random, key, next, res) {
  var options = {
    Bucket: config.s3Bucket,
    Key: random + '/' + key,
    Expires: config.s3Vanish,
    ACL: 'private'
  };

  util.s3.getSignedUrl(type, options, function(err, data) {
    if (err) {
      util.logger.error(err, 'failed on S3.getSignedUrl()');
      return next(new restify.errors.InternalServerError('failed while signing S3 operation'));
    }

    return next(res.send({ signed: data }));
  });
};