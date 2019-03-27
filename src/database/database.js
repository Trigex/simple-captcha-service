const loki = require('lokijs');

const db = new loki('db.json');
const ips = db.addCollection('ips');
db.saveDatabase();
module.exports = ips;