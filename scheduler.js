const log = require("./logger");

log("Scheduler started");

const createTask = (name, interval, task) => {
    setInterval(() => {
        log("Executing task: " + name);
        task();
    }, interval*1000);
}

module.exports = createTask;
