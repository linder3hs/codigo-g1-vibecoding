/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "jest-transform-stub",
    "^.+\\.svg$": "jest-transform-stub",
    "^@/schemas/validationSchemas$":
      "<rootDir>/src/__tests__/mocks/validationSchemas.mock.ts",
    "^@/lib/utils$": "<rootDir>/src/__tests__/mocks/utils.mock.ts",
    "^@/config$": "<rootDir>/src/__tests__/mocks/config.mock.ts",
    "^@/config/env$": "<rootDir>/src/__tests__/mocks/env.mock.ts",
    "^../config/env$": "<rootDir>/src/__tests__/mocks/env.mock.ts",
    "^../../config/env$": "<rootDir>/src/__tests__/mocks/env.mock.ts",
    "^.*\\/config\\/env$": "<rootDir>/src/__tests__/mocks/env.mock.ts",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    ],
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.(test|spec).(ts|tsx|js)",
    "<rootDir>/src/**/?(*.)(test|spec).(ts|tsx|js)",
    "<rootDir>/src/components/**/*.(test|spec).(ts|tsx|js)",
  ],
  collectCoverageFrom: [
    "src/**/*.(ts|tsx)",
    "!src/**/*.d.ts",
    "!src/main.tsx",
    "!src/vite-env.d.ts",
    "!src/schemas/validationSchemas.ts",
    "!src/__tests__/mocks/validationSchemas.mock.ts",
    "!src/__tests__/mocks/handlers/**/*",
    "!src/__tests__/utils/mswUtils.ts",
    "!src/components/ui/**/*",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "/__tests__/.*.(test|spec).[mc]?[jt]sx?$",
  ],
  transformIgnorePatterns: ["node_modules/(?!(.*\\.mjs$))"],
};
