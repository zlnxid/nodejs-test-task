const {ValidationError, TaskExecutionError, ConfigError} = require("./errors");
const config = require('./config');
const createLogger = require('./logger');
const createTask = require('./scheduler');
const createServer = require('./server');

const log = createLogger(config.appName);

const PORT = process.env.PORT || 3000;

try {
    const logWrapper = (message) => log.info(message);

    createTask(
        "Running task",
        config.interval,
        () => {
            log.info("running")
        },
        logWrapper
    );

    const server = createServer();

    server.listen(PORT, () => {
        log.info("Server is running on port: " + PORT);
    });

} catch (error) {

    if (error instanceof ConfigError) {
        log.error(`Configuration error: ${error.message}`);
        log.error(`Parameter: ${error.parameter}`);

    } else if (error instanceof ValidationError) {
        log.error(`Validation Error: ${error.message}`);
        log.error(`Field: ${error.fieldName}`);
        log.error(`Received: ${JSON.stringify(error.receivedValue)}`);

    } else if (error instanceof TaskExecutionError) {
        log.error(`Task Execution Error: ${error.message}`);
        log.error(`Task: ${error.taskName}`);
        log.error(`Original Error: ${error.originalError.message}`);

    } else {
        log.error(`Unexpected Error: ${error.message}`);
    }

    process.exit(1);
}