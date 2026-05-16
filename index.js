const config = require('./config');
const createLogger = require('./logger');
const createTask = require('./scheduler');

const log = createLogger(config.appName);

createTask(
    "Running task",
    config.interval,
    () => { log("running") },
    log
);