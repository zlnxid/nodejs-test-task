const createLogger = require("../logger");
const { ValidationError } = require("../errors");

describe("Logger", () => {

    describe("Logger creation", () => {

        it("should create logger with valid appName", () => {
            const log = createLogger("TestApp");
            expect(log).toBeDefined();
            expect(typeof log).toBe("object");
        });

        it("should throw ValidationError if appName is empty", () => {
            expect(() => {
                createLogger("");
            }).toThrow(ValidationError);
        });

        it("should throw ValidationError if appName is whitespace only", () => {
            expect(() => {
                createLogger("   ");
            }).toThrow(ValidationError);
        });

        it("should throw ValidationError if appName is null", () => {
            expect(() => {
                createLogger(null);
            }).toThrow(ValidationError);
        });

        it("should throw ValidationError if appName is not string", () => {
            expect(() => {
                createLogger(123);
            }).toThrow(ValidationError);

            expect(() => {
                createLogger({});
            }).toThrow(ValidationError);
        });

        it("should throw ValidationError if logLevel is invalid", () => {
            expect(() => {
                createLogger("App", -1);
            }).toThrow(ValidationError);

            expect(() => {
                createLogger("App", 5);
            }).toThrow(ValidationError);

            expect(() => {
                createLogger("App", "info");
            }).toThrow(ValidationError);
        });

        it("should create logger with default logLevel (info)", () => {
            const log = createLogger("TestApp");
            expect(log).toBeDefined();
        });

        it("should create logger with custom logLevel", () => {
            const log = createLogger("TestApp", 0);
            expect(log).toBeDefined();

            const log2 = createLogger("TestApp", 4);
            expect(log2).toBeDefined();
        });

    });

    describe("Logger methods", () => {

        let log;

        beforeEach(() => {
            log = createLogger("TestApp");
        });

        it("should have all logging methods", () => {
            expect(typeof log.trace).toBe("function");
            expect(typeof log.debug).toBe("function");
            expect(typeof log.info).toBe("function");
            expect(typeof log.warn).toBe("function");
            expect(typeof log.error).toBe("function");
        });

        it("should not throw when calling info", () => {
            expect(() => {
                log.info("test message");
            }).not.toThrow();
        });

        it("should not throw when calling error", () => {
            expect(() => {
                log.error("error message");
            }).not.toThrow();
        });

        it("should not throw when calling warn", () => {
            expect(() => {
                log.warn("warning message");
            }).not.toThrow();
        });

        it("should not throw when calling debug", () => {
            expect(() => {
                log.debug("debug message");
            }).not.toThrow();
        });

        it("should not throw when calling trace", () => {
            expect(() => {
                log.trace("trace message");
            }).not.toThrow();
        });

    });

    describe("RequestId parameter", () => {

        let log;

        beforeEach(() => {
            log = createLogger("TestApp");
        });

        it("should accept requestId in info", () => {
            expect(() => {
                log.info("message", "req-123");
            }).not.toThrow();
        });

        it("should accept requestId in error", () => {
            expect(() => {
                log.error("error", "req-456");
            }).not.toThrow();
        });

        it("should accept requestId in warn", () => {
            expect(() => {
                log.warn("warning", "req-789");
            }).not.toThrow();
        });

        it("should accept requestId in debug", () => {
            expect(() => {
                log.debug("debug", "req-abc");
            }).not.toThrow();
        });

        it("should accept requestId in trace", () => {
            expect(() => {
                log.trace("trace", "req-def");
            }).not.toThrow();
        });

        it("should work without requestId", () => {
            expect(() => {
                log.info("message");
                log.error("error");
                log.warn("warning");
                log.debug("debug");
                log.trace("trace");
            }).not.toThrow();
        });

    });

    describe("Log level filtering", () => {

        it("should filter trace when logLevel is info", () => {
            const spy = jest.spyOn(console, "log").mockImplementation();

            const log = createLogger("TestApp", 2);  // info level

            log.trace("trace message");
            expect(spy).not.toHaveBeenCalled();

            spy.mockRestore();
        });

        it("should filter debug when logLevel is info", () => {
            const spy = jest.spyOn(console, "log").mockImplementation();

            const log = createLogger("TestApp", 2);  // info level

            log.debug("debug message");
            expect(spy).not.toHaveBeenCalled();

            spy.mockRestore();
        });

        it("should log info when logLevel is info", () => {
            const spy = jest.spyOn(console, "log").mockImplementation();

            const log = createLogger("TestApp", 2);  // info level

            log.info("info message");
            expect(spy).toHaveBeenCalled();

            spy.mockRestore();
        });

        it("should log all messages when logLevel is trace", () => {
            const spy = jest.spyOn(console, "log").mockImplementation();

            const log = createLogger("TestApp", 0);  // trace level

            log.trace("trace");
            log.debug("debug");
            log.info("info");

            expect(spy).toHaveBeenCalledTimes(3);

            spy.mockRestore();
        });

        it("should use stderr for errors", () => {
            const errorSpy = jest.spyOn(console, "error").mockImplementation();

            const log = createLogger("TestApp");
            log.error("error message");

            expect(errorSpy).toHaveBeenCalled();

            errorSpy.mockRestore();
        });

        it("should use stderr for warnings", () => {
            const errorSpy = jest.spyOn(console, "error").mockImplementation();

            const log = createLogger("TestApp");
            log.warn("warning message");

            expect(errorSpy).toHaveBeenCalled();

            errorSpy.mockRestore();
        });

    });

    describe("LOG_LEVELS export", () => {

        it("should export LOG_LEVELS", () => {
            expect(createLogger.LOG_LEVELS).toBeDefined();
        });

        it("LOG_LEVELS should have correct values", () => {
            expect(createLogger.LOG_LEVELS.trace).toBe(0);
            expect(createLogger.LOG_LEVELS.debug).toBe(1);
            expect(createLogger.LOG_LEVELS.info).toBe(2);
            expect(createLogger.LOG_LEVELS.warn).toBe(3);
            expect(createLogger.LOG_LEVELS.error).toBe(4);
        });

    });

});