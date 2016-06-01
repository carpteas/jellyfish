'use strict';

var mongoose        = require('mongoose');
var morgan          = require('morgan');
var restify         = require('restify');

var authenticate    = require('app/routes/authenticate.js');
var index           = require('app/routes/index.js');
var files           = require('app/routes/files.js');
var load            = require('app/routes/load.js');
var register        = require('app/routes/register.js');
var sink            = require('app/routes/sink.js');
var users           = require('app/routes/users.js');
var wipe            = require('app/routes/wipe.js');
var authorize       = require('app/handlers/authorize.js');
var validate        = require('app/handlers/validate.js');
var config          = require('config.js');
var logger          = require('util.js').logger;

mongoose.connect(process.env.MONGODB_URI || config.database);

var api = restify.createServer({
  log: logger
});

api.pre(morgan('tiny'));
api.use(restify.requestLogger(), restify.bodyParser({
  mapParams: true
}));
api.get('/', index);
api.post('/register', register);
api.get('/users', users);
api.post('/api/authenticate', authenticate);
api.use(authorize);
api.get('/api/files', files);
api.use(validate);
api.put(config.pathRegex, sink);
api.del(config.pathRegex, wipe);
api.get(config.pathRegex, load);

api.listen(process.env.PORT || config.port, function() {
  logger.info('jellyfish now running ....');
});