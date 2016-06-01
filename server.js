'use strict';

var mongoose        = require('mongoose');
var morgan          = require('morgan');
var restify         = require('restify');

var authenticate    = require('/app/routes/authenticate');
var index           = require('/app/routes/index');
var list            = require('/app/routes/list');
var load            = require('/app/routes/load');
var register        = require('/app/routes/register');
var sink            = require('/app/routes/sink');
var wipe            = require('/app/routes/wipe');
var authorize       = require('/app/handlers/authorize');
var validate        = require('/app/handlers/validate');
var config          = require('/config');
var logger          = require('/util').logger;

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
api.post('/api/authenticate', authenticate);
api.use(authorize);
api.get('/api/files', list);
api.use(validate);
api.put(config.pathRegex, sink);
api.del(config.pathRegex, wipe);
api.get(config.pathRegex, load);

api.listen(process.env.PORT || config.port, function() {
  logger.info('jellyfish now running ....');
});