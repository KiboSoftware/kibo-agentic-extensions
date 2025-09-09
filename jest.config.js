export default {
    moduleFileExtensions: [
      "mjs",
      // must include "js" to pass validation https://github.com/facebook/jest/issues/12116
      "js",
    ],
    testRegex: `.spec\.*$`,
    rootDir: "./",
    "testEnvironment": "node",
    "moduleDirectories": ["<rootDir>", "node_modules"],
    "roots": [
        "<rootDir>",
      ],
  };