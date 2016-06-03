'use strict';

var mongoose        = require('mongoose');
var morgan          = require('morgan');
var restify         = require('restify');

var authenticate    = require('app/routes/authenticate.js');
var index           = require('app/routes/index.js');
var files           = require('app/routes/files.js');
var list            = require('app/routes/list.js');
var load            = require('app/routes/load.js');
var register        = require('app/routes/register.js');
var sink            = require('app/routes/sink.js');
var users           = require('app/routes/users.js');
var wipe            = require('app/routes/wipe.js');
var administrate    = require('app/handlers/administrate.js');
var authorize       = require('app/handlers/authorize.js');
var validate        = require('app/handlers/validate.js');
var query           = require('app/handlers/query.js');
var config          = require('config.js');
var logger          = require('util.js').logger;

mongoose.connect(process.env.MONGODB_URI || config.database);

var api = restify.createServer({
  log: logger
});

api.pre(morgan('tiny'));
api.use(
  restify.CORS(),
  restify.requestLogger(),
  restify.queryParser({ mapParams: false }),
  restify.bodyParser({ mapParams: true }));
api.get('/', index);
api.get(config.readRegex, query, validate, load);
api.post('/register', administrate, register);
api.get('/users', administrate, users);
api.get('/files', administrate, files);
api.post('/api/authenticate', authenticate);
api.use(authorize);
api.get('/api/list', list);
api.put(config.writeRegex, validate, sink);
api.del(config.writeRegex, validate, wipe);

api.listen(process.env.PORT || config.port, function() {
  logger.info('jellyfish now running ....');
});