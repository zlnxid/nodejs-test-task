class AppError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, fieldName, receivedValue) {
        super(message);
        this.fieldName = fieldName;
        this.receivedValue = receivedValue;
    }
}

class TaskExecutionError extends AppError {
    constructor(message, taskName, originalError) {
        super(message);
        this.taskName = taskName;
        this.originalError = originalError;
    }
}

class ConfigError extends AppError {
    constructor(message, parameter) {
        super(message);
        this.parameter = parameter;
    }
}

module.exports = {
    AppError,
    ValidationError,
    TaskExecutionError,
    ConfigError
};