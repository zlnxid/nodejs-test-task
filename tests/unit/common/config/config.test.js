const config = require("../../../../src/common/config/config");
const { ConfigError } = require("../../../../src/common/utils/errors");

describe("Config", () => {

    describe("Default config values", () => {

        it("should have appName property", () => {
            expect(config).toHaveProperty("appName");
            expect(config.appName).toBeDefined();
        });

        it("should have interval property", () => {
            expect(config).toHaveProperty("interval");
            expect(config.interval).toBeDefined();
        });

        it("appName should be string", () => {
            expect(typeof config.appName).toBe("string");
        });

        it("appName should be non-empty", () => {
            expect(config.appName).not.toBe("");
            expect(config.appName.length).toBeGreaterThan(0);
        });

        it("interval should be number", () => {
            expect(typeof config.interval).toBe("number");
        });

        it("interval should be positive", () => {
            expect(config.interval).toBeGreaterThan(0);
        });

        it("should have correct default values", () => {
            expect(config.appName).toBe("NodeScheduler");
            expect(config.interval).toBe(10);
        });

    });

    describe("validateConfig function", () => {

        it("should be exported as function", () => {
            expect(config.validateConfig).toBeDefined();
            expect(typeof config.validateConfig).toBe("function");
        });

        describe("appName validation", () => {

            it("should not throw if appName is non-empty string", () => {
                expect(() => {
                    config.validateConfig({
                        appName: "TestApp",
                        interval: 10
                    });
                }).not.toThrow();
            });

            it("should throw ConfigError if appName is empty string", () => {
                expect(() => {
                    config.validateConfig({
                        appName: "",
                        interval: 10
                    });
                }).toThrow(ConfigError);
            });

            it("should throw ConfigError if appName is only whitespace", () => {
                expect(() => {
                    config.validateConfig({
                        appName: "   ",
                        interval: 10
                    });
                }).toThrow(ConfigError);
            });

            it("should throw ConfigError if appName is null", () => {
                expect(() => {
                    config.validateConfig({
                        appName: null,
                        interval: 10
                    });
                }).toThrow(ConfigError);
            });

            it("should throw ConfigError if appName is undefined", () => {
                expect(() => {
                    config.validateConfig({
                        appName: undefined,
                        interval: 10
                    });
                }).toThrow(ConfigError);
            });

            it("should throw ConfigError if appName is not string", () => {
                expect(() => {
                    config.validateConfig({
                        appName: 123,
                        interval: 10
                    });
                }).toThrow(ConfigError);

                expect(() => {
                    config.validateConfig({
                        appName: {},
                        interval: 10
                    });
                }).toThrow(ConfigError);
            });

        });

        describe("interval validation", () => {

            it("should not throw if interval is positive number", () => {
                expect(() => {
                    config.validateConfig({
                        appName: "App",
                        interval: 10
                    });
                }).not.toThrow();

                expect(() => {
                    config.validateConfig({
                        appName: "App",
                        interval: 1
                    });
                }).not.toThrow();
            });

            it("should throw ConfigError if interval is zero", () => {
                expect(() => {
                    config.validateConfig({
                        appName: "App",
                        interval: 0
                    });
                }).toThrow(ConfigError);
            });

            it("should throw ConfigError if interval is negative", () => {
                expect(() => {
                    config.validateConfig({
                        appName: "App",
                        interval: -1
                    });
                }).toThrow(ConfigError);

                expect(() => {
                    config.validateConfig({
                        appName: "App",
                        interval: -100
                    });
                }).toThrow(ConfigError);
            });

            it("should throw ConfigError if interval is not number", () => {
                expect(() => {
                    config.validateConfig({
                        appName: "App",
                        interval: "10"
                    });
                }).toThrow(ConfigError);

                expect(() => {
                    config.validateConfig({
                        appName: "App",
                        interval: null
                    });
                }).toThrow(ConfigError);
            });

        });

        it("should throw error with correct message", () => {
            expect(() => {
                config.validateConfig({
                    appName: "",
                    interval: 10
                });
            }).toThrow(/appName/);
        });

        it("should throw ConfigError instance", () => {
            expect(() => {
                config.validateConfig({
                    appName: "",
                    interval: 10
                });
            }).toThrow(ConfigError);
        });

    });

});