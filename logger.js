const createLogger = (appName) => {
    return (message) => {
        console.log(`[${appName}] ${message}`);
    };
};

module.exports = createLogger;