'use strict';

var uuid            = require('node-uuid');

module.exports = {
  'algorithm': 'HS256',
  'awsAccess': 'AKIAIYD2SCCBHXGE743Q',
  'awsRegion': 'ap-northeast-1',
  'awsSecret': '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',
  'database': 'mongodb://localhost:27017/test',
  'expiresIn': '30m',
  'hmac': 'sha256',
  'pathRegex': /^\/([\w\.~-]+)\/([\w\.~-]+)\/(.*)/,
  'port': 8888,
  'secret': uuid.v4(),
  's3Bucket': 'jellyfish.carpteas',
  's3Vanish': 60
};