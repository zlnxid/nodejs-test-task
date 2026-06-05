const createTask = require("../../../src/core/scheduler");
const { ValidationError, TaskExecutionError } = require("../../../src/common/utils/errors");

describe("Scheduler", () => {

    describe("Task validation", () => {

        it("should throw ValidationError if name is empty", () => {
            const mockLog = jest.fn();

            expect(() => {
                createTask("", 10, () => {}, mockLog);
            }).toThrow(ValidationError);
        });

        it("should throw ValidationError if name is not string", () => {
            const mockLog = jest.fn();

            expect(() => {
                createTask(123, 10, () => {}, mockLog);
            }).toThrow(ValidationError);
        });

        it("should throw ValidationError if interval is not positive", () => {
            const mockLog = jest.fn();

            expect(() => {
                createTask("Task", 0, () => {}, mockLog);
            }).toThrow(ValidationError);
        });

        it("should throw ValidationError if interval is not number", () => {
            const mockLog = jest.fn();

            expect(() => {
                createTask("Task", "10", () => {}, mockLog);
            }).toThrow(ValidationError);
        });

        it("should throw ValidationError if task is not function", () => {
            const mockLog = jest.fn();

            expect(() => {
                createTask("Task", 10, "not a function", mockLog);
            }).toThrow(ValidationError);
        });

        it("should throw ValidationError if log is not function", () => {
            expect(() => {
                createTask("Task", 10, () => {}, "not a function");
            }).toThrow(ValidationError);
        });

    });

    describe("Task scheduling", () => {

        it("should not throw with valid parameters", () => {
            const mockLog = jest.fn();
            const mockTask = jest.fn();

            expect(() => {
                createTask("TestTask", 10, mockTask, mockLog);
            }).not.toThrow();
        });

        it("should call log when task is scheduled", () => {
            const mockLog = jest.fn();
            const mockTask = jest.fn();

            createTask("TestTask", 10, mockTask, mockLog);

            expect(mockLog).toHaveBeenCalled();
            expect(mockLog).toHaveBeenCalledWith(
                expect.stringContaining("Task scheduled")
            );
        });

    });

    describe("Task execution", () => {

        jest.useFakeTimers();

        afterEach(() => {
            jest.clearAllTimers();
        });

        it("should execute task at interval", () => {
            const mockLog = jest.fn();
            const mockTask = jest.fn();

            createTask("Task", 1, mockTask, mockLog);
            jest.advanceTimersByTime(1000);
            expect(mockTask).toHaveBeenCalled();
        });

        it("should call task multiple times", () => {
            const mockLog = jest.fn();
            const mockTask = jest.fn();

            createTask("Task", 1, mockTask, mockLog);

            jest.advanceTimersByTime(1000);
            jest.advanceTimersByTime(1000);
            jest.advanceTimersByTime(1000);

            expect(mockTask).toHaveBeenCalledTimes(3);
        });

        it("should log before executing task", () => {
            const mockLog = jest.fn();
            const mockTask = jest.fn();

            createTask("Task", 1, mockTask, mockLog);
            jest.advanceTimersByTime(1000);
            expect(mockLog.mock.calls.length).toBeGreaterThanOrEqual(2);
        });

    });

    describe("Task execution error handling", () => {

        it("should throw TaskExecutionError if task throws", () => {
            jest.useFakeTimers();

            const mockLog = jest.fn();
            const errorToThrow = new Error("Task failed");
            const mockTask = jest.fn(() => {
                throw errorToThrow;
            });

            createTask("Task", 1, mockTask, mockLog);

            expect(() => {
                jest.advanceTimersByTime(1000);
            }).toThrow(TaskExecutionError);

            jest.useRealTimers();
        });

        it("should wrap original error in TaskExecutionError", () => {
            jest.useFakeTimers();

            const mockLog = jest.fn();
            const originalError = new Error("Original error");
            const mockTask = jest.fn(() => {
                throw originalError;
            });

            let caughtError;
            try {
                createTask("Task", 1, mockTask, mockLog);
                jest.advanceTimersByTime(1000);
            } catch (error) {
                caughtError = error;
            }

            expect(caughtError).toBeInstanceOf(TaskExecutionError);
            expect(caughtError.originalError).toBe(originalError);

            jest.useRealTimers();
        });

    });

});