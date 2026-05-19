const { ValidationError, TaskExecutionError, ConfigError } = require("./errors");
const config = require('./config');
const createLogger = require('./logger');
const createTask = require('./scheduler');

try {
    const log = createLogger(config.appName);

    createTask(
        "Running task",
        config.interval,
        () => {
            log("running")
        },
        log
    );
} catch (error) {
    if (error instanceof ConfigError) {
        console.error(`Configuration error: ${error.message}`);
        console.error(`Parameter: ${error.parameter}`);
    } else if (error instanceof ValidationError) {
        console.error(`Validation Error: ${error.message}`);
        console.error(`Field: ${error.fieldName}`);
        console.error(`Received: ${JSON.stringify(error.receivedValue)}`);
    } else if (error instanceof TaskExecutionError) {
        console.error(`Task Execution Error: ${error.message}`);
        console.error(`Task: ${error.taskName}`);
        console.error(`Original Error: ${error.originalError.message}`);
    } else {
        console.error(`Unexpected Error: ${error.message}`);
    }

    process.exit(1);
}