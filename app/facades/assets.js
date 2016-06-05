'use strict';

var http            = require('http');
var restify         = require('restify');
var wsClient        = require('socket.io-client');

var File            = require('app/models/file.js');
var config          = require('config.js');
var util            = require('util.js');

module.exports.create = function(random, username, path, name, ext, next, callback) {
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
      next.ifError(new restify.InternalServerError('failed while saving to database'));
    }

    callback();
  });
};

module.exports.read = function(bucket, random, key, next, res) {
  util.logger.info('reading [%s]/%s', random, key);

  var file = util.s3.getObject({ Bucket: bucket, Key: random + '/' + key });
  file.on('error', function(err) {
    util.logger.error(err, 'failed on S3.getObject()');
    next.ifError(new restify.NotFoundError('file not found inside S3'));
  });

  file.createReadStream().pipe(res);
};

module.exports.update = function(random, name, ext, next, callback) {
  File.findOne({ randomness: random, name: name, ext: ext }, function(err, file) {
    if (err) {
      util.logger.error(err, 'failed on File.findOne()');
      next.ifError(new restify.InternalServerError('failed while reading from database'));
    }

    file.lastUpdate = new Date;
    file.save(function(err) {
      if (err) {
        util.logger.error(err, 'failed on File.save()');
        next.ifError(new restify.InternalServerError('failed while saving to database'));
      }

      callback();
    });
  });
};

module.exports.delete = function(bucket, random, name, ext, key, next, res) {
  File.remove({ randomness: random, name: name, ext: ext }, function(err, file) {
    if (err) {
      util.logger.error(err, 'failed on File.remove()');
      next.ifError(new restify.InternalServerError('failed while saving to database'));
    }

    util.s3.deleteObjects({
      Bucket: bucket,
      Delete: { Objects: [{ Key: random + '/' + key }] }
    }, function(err, data) {
        if (err) {
          util.logger.error(err, 'failed on S3.deleteObjects()');
          next.ifError(new restify.InternalServerError('failed while deleting S3 objects'));
        }

        return next(res.send({ success: true }));
    });
  });
};

module.exports.exist = function(random, name, ext, next, callback) {
  File.count({ randomness: random, name: name, ext: ext }, function(err, count) {
    if (err) {
      util.logger.error(err, 'failed on File.count()');
      next.ifError(new restify.InternalServerError('failed while reading from database'));
    }

    callback(count !== 0);
  });
};

module.exports.search = function(criteria, next, res) {
  File.find(criteria, function(err, files) {
    return next(res.send(files));
  });
};

module.exports.sign = function(operation, bucket, random, key, next, res) {
  var options = {
    Bucket: bucket,
    Key: random + '/' + key,
    Expires: config.s3Vanish,
    ACL: 'private'
  };

  util.s3.getSignedUrl(operation, options, function(err, data) {
    if (err) {
      util.logger.error(err, 'failed on S3.getSignedUrl()');
      next.ifError(new restify.InternalServerError('failed while signing S3 operation'));
    }

    return next(res.send({ signedUrl: data }));
  });
};

module.exports.transform = function(bucket, random, key, extra, next, res) {
  util.logger.info('reading [%s]/%s with extrargs[%s]', random, key, extra);
/*
// blitline url
{
    application_id: 'YOUR_APP_ID',
    postback_url: config.host + '/blitline';,
    src: 'http://cdn.blitline.com/filters/boys.jpeg',
// metas
    src_data: { colorspace: 'srgb' },
    get_exif: true,
    v: 1.20,
// functions
    functions: [
        {
            name: 'resize_to_fit',
            params: {
                width: 100,
                autosharpen: true
            },
            save: {
                image_identifier: 'MY_CLIENT_ID'
            }
        }
    ]
}
*/
  var pending = extra;

  var ws = wsClient(process.env.BACK_WSS || config.backwss);
  ws.on('blitline', function(results) {
    if (results['job_id'] === pending) {
      if (Boolean(results['errors'])) {
        util.logger.error(results['errors']);
        next.ifError(new restify.InternalServerError(results['errors']));
      }

      http.get({
        host: 's-media-cache-ak0.pinimg.com',
        path: '/originals/fb/be/16/fbbe160f8974fada59e833b93fec2598.jpg'
      }, function (response) {
        response.on('error', function(err) {
          util.logger.error(err, 'failed on retrieving the transformed result');
          next.ifError(new restify.InternalServerError('failure during file\'s transformation'));
        });

        response.pipe(res);
      });
    }
  });
};