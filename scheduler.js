const createTask = (name, interval, task, log) => {
    log(`Task scheduled: ${name}`);

    setInterval(() => {
        log("Executing task: " + name);
        task();
    }, interval*1000);
}

module.exports = createTask;
