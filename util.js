'use strict';

var aws             = require('aws-sdk');
var bunyan          = require('bunyan');
var crypto          = require('crypto');

var config          = require('/config');

const LOGGER = bunyan.createLogger({
  name: 'jellyfish',
  streams: [
    {
      level: 'info',
      stream: process.stdout
    },
    {
      level: 'error',
      type: 'rotating-file',
      path: './jellyfish-error.log',
      period: '1d',
      count: 7
    }
  ],
  serializers: bunyan.stdSerializers
});
LOGGER.info('logger setup ready ....');

aws.config.update({
  accessKeyId: config.awsAccess,
  secretAccessKey: config.awsSecret,
  region: config.awsRegion
});
const S3 = new aws.S3();
LOGGER.info('s3 setup ready ....');

module.exports.logger = LOGGER;
module.exports.s3 = S3;
module.exports.hash = function(password, salt) {
  var hash = crypto.createHmac(config.hmac, salt);
  hash.update(password);

  return hash.digest('hex');
};