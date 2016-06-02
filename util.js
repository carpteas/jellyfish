'use strict';

var aws             = require('aws-sdk');
var bunyan          = require('bunyan');
var crypto          = require('crypto');

var config          = require('config.js');

const LOGGER = bunyan.createLogger({
  name: 'jellyfish',
  streams: [
    {
      level: config.logLevel,
      stream: process.stdout
    },
    {
      level: 'error',
      type: 'rotating-file',
      path: config.logError,
      period: '1d',
      count: 7
    }
  ],
  serializers: bunyan.stdSerializers
});
module.exports.logger = LOGGER;
LOGGER.info('logger setup ready ....');

aws.config.update({
  accessKeyId: config.awsAccess,
  secretAccessKey: process.env.SECRET_ACCESS || config.awsSecret,
  region: config.awsRegion
});
const S3 = new aws.S3();
module.exports.s3 = S3;
LOGGER.info('s3 setup ready ....');

module.exports.hash = function(password, salt) {
  var hash = crypto.createHmac(config.hmac, salt);
  hash.update(password);

  return hash.digest('hex');
};

module.exports.getBucket = function(username) {
  return 'jellyfish-carpteas-' + username;
};

module.exports.getRandom = function(filepath, bucket) {
  return module.exports.hash(filepath, bucket);
};

module.exports.getKey = function(filename, fileext) {
  return filename + '.' + fileext;
};