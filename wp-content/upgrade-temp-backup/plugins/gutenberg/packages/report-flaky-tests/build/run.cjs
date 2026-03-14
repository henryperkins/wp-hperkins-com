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

// packages/report-flaky-tests/src/run.ts
var run_exports = {};
__export(run_exports, {
  run: () => run
});
module.exports = __toCommonJS(run_exports);
var github = __toESM(require("@actions/github"));
var core = __toESM(require("@actions/core"));
var fs = __toESM(require("fs/promises"));
var path = __toESM(require("path"));
var import_github_api = require("./github-api.cjs");
var import_markdown = require("./markdown.cjs");
async function run() {
  const token = core.getInput("repo-token", { required: true });
  const artifactPath = core.getInput("artifact-path", {
    required: true
  });
  const { runId: runID, repo, ref } = github.context;
  const runURL = `https://github.com/${repo.owner}/${repo.repo}/actions/runs/${runID}`;
  const api = new import_github_api.GitHubAPI(token, repo);
  const flakyTestsDir = await fs.readdir(artifactPath);
  const flakyTests = await Promise.all(
    flakyTestsDir.map(
      (filename) => fs.readFile(path.join(artifactPath, filename), "utf-8").then((text) => JSON.parse(text))
    )
  );
  if (!flakyTests || flakyTests.length === 0) {
    return;
  }
  const isPR = github.context.eventName === "pull_request";
  const headBranch = isPR ? (
    // Cast the payload type: https://github.com/actions/toolkit/tree/main/packages/github#webhook-payload-typescript-definitions
    github.context.payload.pull_request.head.ref
  ) : ref.replace(/^refs\/(heads|tag)\//, "");
  const label = core.getInput("label", { required: true });
  const issues = await api.fetchAllIssuesLabeledFlaky(label);
  const reportedIssues = [];
  for (const flakyTest of flakyTests) {
    const { title: testTitle } = flakyTest;
    const issueTitle = getIssueTitle(testTitle);
    const reportedIssue = issues.find(
      (issue2) => issue2.title === issueTitle
    );
    const testPath = flakyTest.path.startsWith(process.cwd()) ? flakyTest.path.slice(process.cwd().length) : flakyTest.path;
    let issue;
    const currentFormattedTestResults = (0, import_markdown.formatTestResults)({
      date: /* @__PURE__ */ new Date(),
      failedTimes: flakyTest.results.length,
      headBranch,
      runURL,
      // Always output the latest test results' stacks.
      errorMessage: (0, import_markdown.formatTestErrorMessage)(flakyTest)
    });
    if (reportedIssue) {
      const body = reportedIssue.body;
      if (reportedIssue.closed_at) {
        try {
          const latestAncestorCommit = await api.findMergeBaseCommit(
            "trunk",
            github.context.sha
          );
          const latestAncestorDate = latestAncestorCommit.committer?.date;
          if (!latestAncestorDate) {
            return;
          }
          if (new Date(reportedIssue.closed_at) >= new Date(latestAncestorDate)) {
            return;
          }
        } catch (error2) {
          core.error(
            error2 instanceof Error ? error2 : String(error2)
          );
          return;
        }
      }
      const { meta, testResults: prevTestResults } = (0, import_markdown.parseIssueBody)(body);
      const formattedTestResults = [
        ...prevTestResults.map(
          (testResult) => (0, import_markdown.formatTestResults)({
            ...testResult,
            // Don't output previous test results' stacks.
            errorMessage: void 0
          })
        ),
        currentFormattedTestResults
      ].join("\n<br/>\n");
      issue = await api.updateIssue({
        issue_number: reportedIssue.number,
        state: "open",
        body: (0, import_markdown.renderIssueBody)({
          meta,
          testTitle,
          testPath,
          formattedTestResults
        })
      });
    } else if (!reportedIssue && // Don't create a flaky test issue if the test was run inside a PR.
    !isPR) {
      issue = await api.createIssue({
        title: issueTitle,
        body: (0, import_markdown.renderIssueBody)({
          meta: {},
          testTitle,
          testPath,
          formattedTestResults: currentFormattedTestResults
        }),
        labels: [label]
      });
    }
    if (issue) {
      reportedIssues.push({
        testTitle,
        testPath,
        issueNumber: issue.number,
        issueUrl: issue.html_url
      });
      core.info(`Reported flaky test to ${issue.html_url}`);
    }
  }
  if (reportedIssues.length === 0) {
    return;
  }
  const { html_url: commentUrl } = isPR ? await api.createCommentOnPR(
    // Cast the payload type: https://github.com/actions/toolkit/tree/main/packages/github#webhook-payload-typescript-definitions
    github.context.payload.number,
    (0, import_markdown.renderCommitComment)({
      runURL,
      reportedIssues,
      commitSHA: github.context.payload.pull_request.head.sha
    }),
    import_markdown.isReportComment
  ) : await api.createCommentOnCommit(
    github.context.sha,
    (0, import_markdown.renderCommitComment)({
      runURL,
      reportedIssues,
      commitSHA: github.context.sha
    }),
    import_markdown.isReportComment
  );
  core.info(`Reported the summary of the flaky tests to ${commentUrl}`);
}
function getIssueTitle(testTitle) {
  return `[Flaky Test] ${testTitle}`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  run
});
//# sourceMappingURL=run.cjs.map
