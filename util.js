'use strict';

var aws             = require('aws-sdk');
var bunyan          = require('bunyan');
var crypto          = require('crypto');
var redis           = require('redis').createClient;
var Blitline        = require('simple_blitline_node');
var emitter         = require('socket.io-emitter');

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

const BLITLINE = new Blitline();
module.exports.blitline = BLITLINE;
LOGGER.info('blitline setup ready ....');

const EMITTER = emitter(redis(
  process.env.REDIS_PORT || config.redisPort,
  process.env.REDIS_HOST || config.redisHost, {
    auth_pass: process.env.REDIS_PASS || config.redisPass
}));
module.exports.emitter = EMITTER;
LOGGER.info('socket.io-emitter setup ready ....');

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS || config.awsAccess,
  secretAccessKey: process.env.AWS_SECRET || config.awsSecret,
  region: config.awsRegion
});
const S3 = new aws.S3();
module.exports.s3 = S3;
LOGGER.info('s3 setup ready ....');

function hash(password, salt) {
  var hash = crypto.createHmac(config.hmac, salt);
  hash.update(password);

  return hash.digest('hex');
}
module.exports.hash = hash;

module.exports.getBucket = function(username) {
  return hash(username, 'jellyfish').substr(0, 6) + '-' + username;
};

module.exports.getRandom = function(filepath, bucket) {
  return hash(filepath, bucket);
};

module.exports.getKey = function(filename, fileext) {
  return filename + '.' + fileext;
};