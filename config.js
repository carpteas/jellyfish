'use strict';

var uuid            = require('node-uuid');

module.exports = {
  'algorithm': 'HS256',
  'awsAccess': 'AKIAJQ75TXVUWG3LPMVQ',
  'awsRegion': 'ap-northeast-1',
  'awsSecret': '',
  'backwss': '',
  'database': 'mongodb://localhost:27017/test',
  'expiresIn': '30m',
  'host': 'http://jellyfish.carpteas.com',
  'hmac': 'sha256',
  'logError': './jellyfish-error.log',
  'logLevel': 'error',
  'readRegex': /^\/\basset\b\/([\w\.~-]+)\/([\w\.~-]+)\/(.*)/,
  'redisHost': 'localhost',
  'redisPort': '6379',
  'redisPass': '',
  'writeRegex': /^\/\bapi\b\/([\w\.~-]+)\/([\w\.~-]+)\/(.*)/,
  'port': 8888,
  'secret': uuid.v4(),
  's3Vanish': 30
};