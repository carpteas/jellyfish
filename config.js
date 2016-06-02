'use strict';

var uuid            = require('node-uuid');

module.exports = {
  'algorithm': 'HS256',
  'awsAccess': 'AKIAJQ75TXVUWG3LPMVQ',
  'awsRegion': 'ap-northeast-1',
  'awsSecret': '',
  'database': 'mongodb://localhost:27017/test',
  'expiresIn': '30m',
  'hmac': 'sha256',
  'logError': './jellyfish-error.log',
  'logLevel': 'info',
  'readRegex': /^\/\bdock\b\/([\w\.~-]+)\/([\w\.~-]+)\/(.*)/,
  'writeRegex': /^\/\bapi\b\/([\w\.~-]+)\/([\w\.~-]+)\/(.*)/,
  'port': 8888,
  'secret': uuid.v4(),
  's3Vanish': 10
};