require('dotenv').config();

const {ValidationError, TaskExecutionError, ConfigError} = require("./src/common/utils/errors");
const config = require('./src/common/config/config');
const createLogger = require('./src/common/utils/logger');
const { createTask, stopAllTasks } = require('./src/core/scheduler');
const createServer = require('./src/core/server');
const updatePriceTask = require('./src/tasks/updatePricesTask');

const log = createLogger(config.appName);

const PORT = process.env.PORT || 3000;

try {
    const logWrapper = (message) => log.info(message);

    createTask(
        "Update currency prices from Binance",
        config.interval,
        updatePriceTask,
        logWrapper
    );

    const app = createServer();

    const server = app.listen(PORT, () => {
        log.info("Server is running on port: " + PORT);
    });

    const gracefulShutdown = (signal) => {
        log.info(`Received ${signal}, stopping tasks and closing server`);
        stopAllTasks();
        server.close(() => {
            log.info("Server closed");
            process.exit(0);
        });

        setTimeout(() => {
            log.error("Server did not close in 10 seconds, force exit");
            process.exit(1);
        }, 10000);
    };

    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

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