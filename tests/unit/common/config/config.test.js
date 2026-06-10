const config = require("../../../../src/common/config/config");
const { ConfigError } = require("../../../../src/common/utils/errors");

describe("Config", () => {

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

            it("should throw ConfigError if appName is not string", () => {
                expect(() => {
                    config.validateConfig({
                        appName: 123,
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
            });

            it("should throw ConfigError if interval is not number", () => {
                expect(() => {
                    config.validateConfig({
                        appName: "App",
                        interval: "10"
                    });
                }).toThrow(ConfigError);
            });
        });
    });

});