const controller = require('../controllers/index.controller');

function routes(server) {
    server.get('/captcha', controller.getCaptcha);
    server.get('/captcha/check', controller.checkCaptcha);
}

module.exports = routes;