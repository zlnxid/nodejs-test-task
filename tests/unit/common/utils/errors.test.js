const {
    AppError,
    ValidationError,
    TaskExecutionError,
    ConfigError
} = require("../../../../src/common/utils/errors");

describe("Errors", () => {

    describe("AppError", () => {

        it("should create AppError with message", () => {
            const error = new AppError("Test error");

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(AppError);
            expect(error.message).toBe("Test error");
        });

        it("should have correct name", () => {
            const error = new AppError("Test");
            expect(error.name).toBe("AppError");
        });
    });

    describe("ValidationError", () => {

        it("should create ValidationError with fieldName and receivedValue", () => {
            const error = new ValidationError(
                "Field is invalid",
                "email",
                "not-an-email"
            );

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(ValidationError);
            expect(error.message).toBe("Field is invalid");
            expect(error.fieldName).toBe("email");
            expect(error.receivedValue).toBe("not-an-email");
        });

        it("should have correct name", () => {
            const error = new ValidationError("Test", "field", "value");
            expect(error.name).toBe("ValidationError");
        });
    });

    describe("ConfigError", () => {

        it("should create ConfigError with parameter", () => {
            const error = new ConfigError("Invalid config", "appName");

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(ConfigError);
            expect(error.message).toBe("Invalid config");
            expect(error.parameter).toBe("appName");
        });

        it("should have correct name", () => {
            const error = new ConfigError("Test", "param");
            expect(error.name).toBe("ConfigError");
        });
    });

    describe("TaskExecutionError", () => {

        it("should create TaskExecutionError with taskName and originalError", () => {
            const originalError = new Error("Original error");
            const error = new TaskExecutionError(
                "Task failed",
                "MyTask",
                originalError
            );

            expect(error).toBeInstanceOf(Error);
            expect(error).toBeInstanceOf(AppError);
            expect(error).toBeInstanceOf(TaskExecutionError);
            expect(error.message).toBe("Task failed");
            expect(error.taskName).toBe("MyTask");
            expect(error.originalError).toBe(originalError);
        });

        it("should have correct name", () => {
            const error = new TaskExecutionError("Msg", "Task", new Error());
            expect(error.name).toBe("TaskExecutionError");
        });
    });

    describe("Error inheritance", () => {

        it("all custom errors should inherit from AppError", () => {
            const configError = new ConfigError("Test", "param");
            const taskError = new TaskExecutionError("Test", "Task", new Error());
            const validationError = new ValidationError("Test", "field", "value");

            expect(configError).toBeInstanceOf(AppError);
            expect(taskError).toBeInstanceOf(AppError);
            expect(validationError).toBeInstanceOf(AppError);
        });
    });
});