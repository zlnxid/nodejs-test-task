const { ValidationError, TaskExecutionError } = require("../common/utils/errors");

const timers = [];

const createTask = (name, interval, task, log) => {

    if (typeof name !== "string" || name.trim() === "") {
        throw new ValidationError(
            "Task name must be a non-empty string",
            "name",
            name
        );
    }

    if (typeof interval !== "number" || interval <= 0) {
        throw new ValidationError(
            "Task interval must be a positive number",
            "interval",
            interval
        );
    }

    if (typeof task !== "function") {
        throw new ValidationError(
            "Task task must be a function",
            "task",
            task
        );
    }

    if (typeof log !== "function") {
        throw new ValidationError(
            "Logger must be a function",
            "log",
            log
        );
    }

    log(`Task scheduled: ${name}`);

    const timerId = setInterval(() => {
        log("Executing task: " + name);

        task().catch(error => {
            throw new TaskExecutionError(
                `Error executing task: ${name}`,
                name,
                error
            );
        });
    }, interval*1000);

    timers.push(timerId);
    return timerId;
};

const stopAllTasks = () => {
    timers.forEach(timerId => clearInterval(timerId));
    timers.length = 0;
};

module.exports = { createTask, stopAllTasks };
