const { ValidationError } = require("./errors");

const createLogger = (appName) => {

    if (typeof appName !== "string" || appName.trim() === "") {
        throw new ValidationError(
            "App name must be a non-empty string.",
            "appName",
            appName
        );
    }
    return (message) => {
        console.log(`[${appName}] ${message}`);
    };
};

module.exports = createLogger;