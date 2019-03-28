const services = require('../services/index.services');

async function getCaptcha(req, res, next) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    if(await services.isInDatabase(ip)) {
        // get user's svg
        let svg = await services.retrieveSvg(ip);
        res.send({error: `You've already requested a captcha, yet haven't solved it`, svg: svg});
        next(false);
    } else {
        let captcha = await services.generateCaptcha(ip);
        res.contentType = 'json';
        res.send({captcha: captcha});
        next();
    }
}

async function checkCaptcha(req, res, next) {
    let {ip, solution} = req.query;
    let status = await services.checkCaptcha(ip, solution);
    if(status === null) {
        res.send({error: 'You have not requested a captcha'});
        next(false);
    } else if(status === true) {
        await services.removeIp(ip);
        res.send({success: true});
        next();
    } else if (!status) {
        res.send({success: false});
    }
}

module.exports = {
    getCaptcha,
    checkCaptcha
}