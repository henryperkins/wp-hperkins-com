"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/report-flaky-tests/src/markdown.ts
var markdown_exports = {};
__export(markdown_exports, {
  formatTestErrorMessage: () => formatTestErrorMessage,
  formatTestResults: () => formatTestResults,
  isReportComment: () => isReportComment,
  parseFormattedTestResults: () => parseFormattedTestResults,
  parseIssueBody: () => parseIssueBody,
  renderCommitComment: () => renderCommitComment,
  renderIssueBody: () => renderIssueBody
});
module.exports = __toCommonJS(markdown_exports);
var import_path = __toESM(require("path"));
var import_jest_message_util = require("jest-message-util");
var core = __toESM(require("@actions/core"));
var import_strip_ansi = require("./strip-ansi.cjs");
var TEST_RESULTS_LIST = {
  open: `<!-- __TEST_RESULTS_LIST__ -->`,
  close: `<!-- /__TEST_RESULTS_LIST__ -->`
};
var TEST_RESULT = {
  open: "<!-- __TEST_RESULT__ -->",
  close: "<!-- /__TEST_RESULT__ -->"
};
var metaData = {
  render: (json) => `<!-- __META_DATA__:${JSON.stringify(json)} -->`,
  get: (str) => {
    const matched = str.match(/<!-- __META_DATA__:(.*) -->/);
    try {
      if (matched) {
        return JSON.parse(matched[1]);
      }
    } catch (error2) {
    }
    return void 0;
  }
};
var TEST_LOG_REGEX = new RegExp(
  `<time datetime="(?<date>.+)">.*</time>\\s*Test passed after (?<failedTimes>\\d) failed attempts? on <a href="(?<runURL>.+)"><code>(?<headBranch>.+)</code></a>\\.`
);
var TEST_FULL_REGEX = new RegExp(
  `(?:<details>\\s*<summary>\\s*)?${TEST_LOG_REGEX.source}(?:\\s*</summary>\\s*
\`\`\`
(?<errorMessage>[\\s\\S]*)
\`\`\`
\\s*</details>)?`
);
function renderIssueBody({
  meta,
  testTitle,
  testPath,
  formattedTestResults
}) {
  return `${metaData.render(meta)}
**Flaky test detected. This is an auto-generated issue by GitHub Actions. Please do NOT edit this manually.**

## Test title
${testTitle}

## Test path
\`${testPath}\`

## Errors
${TEST_RESULTS_LIST.open}
${formattedTestResults}
${TEST_RESULTS_LIST.close}
`;
}
function formatTestErrorMessage(flakyTestResult) {
  switch (flakyTestResult.runner) {
    case "@playwright/test": {
      return (0, import_strip_ansi.stripAnsi)(
        flakyTestResult.results.map((result) => result.error.stack).join("\n")
      );
    }
    case "jest-circus":
    default: {
      return (0, import_strip_ansi.stripAnsi)(
        (0, import_jest_message_util.formatResultsErrors)(
          flakyTestResult.results,
          {
            rootDir: import_path.default.join(
              process.cwd(),
              "packages/e2e-tests"
            ),
            // This is useless just to make typescript happy.
            testMatch: []
          },
          { noStackTrace: false },
          flakyTestResult.path
        )
      );
    }
  }
}
function formatTestResults({
  date,
  failedTimes,
  headBranch,
  runURL,
  errorMessage
}) {
  const dateString = date.toISOString();
  const log = `<time datetime="${dateString}"><code>[${dateString}]</code></time> Test passed after ${failedTimes} failed ${failedTimes === 1 ? "attempt" : "attempts"} on <a href="${runURL}"><code>${headBranch}</code></a>.`;
  if (!errorMessage) {
    return `${TEST_RESULT.open}${log}${TEST_RESULT.close}`;
  }
  return `${TEST_RESULT.open}<details>
<summary>
	${log}
</summary>

\`\`\`
${errorMessage}
\`\`\`
</details>${TEST_RESULT.close}`;
}
function parseFormattedTestResults(formattedTestResults) {
  const matches = formattedTestResults.replace(/\r\n/g, "\n").match(TEST_FULL_REGEX);
  if (!matches) {
    throw new Error(`Unable to parse the test results:
${formattedTestResults}`);
  }
  const { date, failedTimes, runURL, headBranch, errorMessage } = matches.groups;
  return {
    date: new Date(date),
    failedTimes: parseInt(failedTimes, 10),
    runURL,
    headBranch,
    errorMessage
  };
}
function parseIssueBody(body) {
  const meta = metaData.get(body);
  if (!meta) {
    throw new Error("Unable to parse meta data from issue.");
  }
  const testResults = Array.from(
    body.matchAll(
      new RegExp(
        `^${TEST_RESULT.open}[\\s\\S]+?${TEST_RESULT.close}$`,
        "gm"
      )
    )
  ).map(([match]) => match).map((testResult) => {
    try {
      return parseFormattedTestResults(testResult);
    } catch (error2) {
      core.error(error2);
      return void 0;
    }
  }).filter(
    (testResult) => testResult !== void 0
  );
  return {
    meta,
    testResults
  };
}
var FLAKY_TESTS_REPORT_COMMENT_TOKEN = `flaky-tests-report-comment`;
function renderCommitComment({
  reportedIssues,
  runURL,
  commitSHA
}) {
  return `<!-- ${FLAKY_TESTS_REPORT_COMMENT_TOKEN} -->
**Flaky tests detected in ${commitSHA}.**
Some tests passed with failed attempts. The failures may not be related to this commit but are still reported for visibility. See [the documentation](https://github.com/WordPress/gutenberg/blob/HEAD/docs/contributors/code/testing-overview.md#flaky-tests) for more information.

\u{1F50D}  Workflow run URL: ${runURL}
\u{1F4DD}  Reported issues:
${reportedIssues.map((issue) => `- #${issue.issueNumber} in \`${issue.testPath}\``).join("\n")}`;
}
function isReportComment(body) {
  return body.startsWith(`<!-- ${FLAKY_TESTS_REPORT_COMMENT_TOKEN} -->`);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  formatTestErrorMessage,
  formatTestResults,
  isReportComment,
  parseFormattedTestResults,
  parseIssueBody,
  renderCommitComment,
  renderIssueBody
});
//# sourceMappingURL=markdown.cjs.map
