// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
    testEnvironment: "node",
    errorOnDeprecated: true,
    resetModules: true,
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.js"],
    coverageDirectory: "coverage",
    coverageReporters: [
      "text",
      "lcov",
    ],
    moduleDirectories: ["node_modules", "src"]
};
