const svgCaptcha = require('svg-captcha');
const config = require('../../config.json');
const db = require('../database/database');
const pino = require('../utils/pino');

async function generateCaptcha(ip) {
    // create captcha
    let captcha = await svgCaptcha.create({
        size: config.captcha.size,
        noise: config.captcha.noise,
        color: config.captcha.color
    });

    // insert with ip into database
    await db.insert({
        ip: ip,
        solution: captcha.text,
        svg: captcha.data
    });

    let entry = await db.find({ip: ip})[0];
    pino.info(`IP ${entry.ip} added into database with captcha ${entry.solution}`);

    // timer till removed
    setTimeout(removeIp.bind(null, ip), config.captcha.timeWindow);

    // return captcha svg
    return captcha.data;
}

async function checkCaptcha(ip, solution) {
    if(await isInDatabase(ip)) {
        let entry = await db.find({ip: ip})[0];
        if(entry.solution === solution) {
            return true;
        } else {
            return false;
        }
    } else {
        // user has not generated a captcha
        return null;
    }
}

async function retrieveSvg(ip) {
    let entry = await db.find({ip: ip})[0];
    return entry.svg;
}

function removeIp(ip) {
    db.removeWhere({ip: ip});
    pino.info(`IP ${ip} removed from the database`);
}

async function isInDatabase(ip) {
    let entry = await db.find({ip: ip});
    pino.info(`Database checked for the presense of IP ${ip}, result: ${entry}`);

    if(entry && entry.length) {
        return true;
    } else {
        return false;
    }
}

module.exports = {
    generateCaptcha,
    isInDatabase,
    checkCaptcha,
    removeIp,
    retrieveSvg
}