process.env.NODE_ENV = 'test';
require('dotenv').config({ path: '.env.test' });
process.env.JWT_SECRET = process.env.JWT_SECRET || "default_test_secret";

module.exports = {

    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        "^.+\\.ts$": "ts-jest"
    },
    moduleFileExtensions: ["ts", "js", "json"],
    testMatch: ["**/tests/**/*.test.ts"],
    coverageThreshold: {
        global: {
            branches: 0,
            functions: 90,
            lines: 90,
            statements: 90
        }
    }
    
};