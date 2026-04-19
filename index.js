const config = require('./config');
const log = require('./logger');
const createTask = require('./scheduler');

createTask("Running task", config.interval, () => { log("running") });