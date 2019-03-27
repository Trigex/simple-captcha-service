const config = require('../config.json');
const restify = require('restify');
const pino = require('./utils/pino');
const routes = require('./routes/index.routes');
const corsMiddleware = require('restify-cors-middleware');

const server = restify.createServer({name: 'Simple Captcha Service'});
const cors = corsMiddleware({
    origins: ['*'],
    allowHeaders: ['Content-Type', 'Accept', 'Access-Control-Allow-Headers']
});
server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.queryParser());
server.use(restify.plugins.throttle({
    burst: config.server.throttling.burst,
    rate: config.server.throttling.rate,
    ip: config.server.throttling.ip
}));

require('./routes/index.routes')(server);

server.listen(config.server.port, () => {
    pino.info(`Server is listening on port ${config.server.port}`);
});