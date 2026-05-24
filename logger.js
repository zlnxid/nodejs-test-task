const { ValidationError } = require("./errors");

const LOG_LEVELS = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4
};

const createLogger = (appName, logLevel = LOG_LEVELS.info) => {

    if (typeof appName !== "string" || appName.trim() === "") {
        throw new ValidationError(
            "App name must be a non-empty string.",
            "appName",
            appName
        );
    }

    if (typeof logLevel !== "number" || logLevel < 0 || logLevel > 4) {
        throw new ValidationError(
            "Log level must be a number between 0 and 4.",
            "logLevel",
            logLevel
        );
    }

    const formatMessage = (level, message, requestId = null) => {
        const timestamp = new Date().toISOString();
        const requestIdPart = requestId ? ` [${requestId}]` : "";
        return `${timestamp} [${appName}] [${level.toUpperCase()}]${requestIdPart} ${message}`;
    };

    const logMessage = (level, message, requestId = null) => {
        if (LOG_LEVELS[level] < logLevel) {
            return;
        }
        const formatted = formatMessage(level, message, requestId);

        if (level === "error" || level === "warn") {
            console.error(formatted);
        } else {
            console.log(formatted);
        }
    };

    return {
        error: (message, requestId = null) => logMessage("error", message, requestId),
        warn: (message, requestId = null) => logMessage("warn", message, requestId),
        info: (message, requestId = null) => logMessage("info", message, requestId),
        debug: (message, requestId = null) => logMessage("debug", message, requestId),
        trace: (message, requestId = null) => logMessage("trace", message, requestId),
    };
};

module.exports = createLogger;
module.exports.LOG_LEVELS = LOG_LEVELS;