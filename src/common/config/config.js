const {ConfigError} = require("../utils/errors");
const config = {
    appName: "NodeScheduler",
    interval: 10
};

function validateConfig(config) {
    if (typeof config.appName !== "string" || config.appName.trim() === "") {
        throw new ConfigError(
            "Config: appName must be a non-empty string.",
            "appName"
        );
    }

    if (typeof config.interval !== "number" || config.interval <= 0 ) {
        throw new ConfigError(
            "Config: interval must be a positive integer.",
            "interval"
        );
    }
}

validateConfig(config);

module.exports = config;
module.exports.validateConfig = validateConfig;