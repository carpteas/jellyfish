'use strict';

var uuid            = require('node-uuid');

module.exports = {
  algorithm: 'HS256',
  awsAccess: 'YOUR_AWS_ACCESS',
  awsRegion: 'ap-northeast-1',
  awsSecret: 'YOUR_AWS_SECRET',
  backwss: 'YOUR_WS_SERVER',
  blitline: 'YOUR_BLITLINE_ID',
  database: 'mongodb://localhost:27017/test',
  expiresIn: '30m',
  host: 'http://jellyfish.carpteas.com',
  hmac: 'sha256',
  logError: './jellyfish-error.log',
  logLevel: 'error',
  readRegex: /^\/\basset\b\/([\w\.~-]+)\/([\w\.~-]+)\/(.*)/,
  redisHost: 'localhost',
  redisPort: '6379',
  redisPass: '',
  writeRegex: /^\/\bapi\b\/([\w\.~-]+)\/([\w\.~-]+)\/(.*)/,
  port: 8888,
  secret: uuid.v4(),
  s3Vanish: 30
};