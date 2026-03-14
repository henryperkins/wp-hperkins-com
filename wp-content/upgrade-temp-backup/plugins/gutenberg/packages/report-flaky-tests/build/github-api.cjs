"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/report-flaky-tests/src/github-api.ts
var github_api_exports = {};
__export(github_api_exports, {
  GitHubAPI: () => GitHubAPI
});
module.exports = __toCommonJS(github_api_exports);
var import_github = require("@actions/github");
var GitHubAPI = class {
  #octokit;
  #repo;
  constructor(token, repo) {
    this.#octokit = (0, import_github.getOctokit)(token);
    this.#repo = repo;
  }
  async fetchAllIssuesLabeledFlaky(label) {
    const issues = await this.#octokit.paginate(
      this.#octokit.rest.issues.listForRepo,
      {
        ...this.#repo,
        state: "all",
        labels: label
      }
    );
    return issues;
  }
  async findMergeBaseCommit(baseCommit, headCommit) {
    const { data } = await this.#octokit.rest.repos.compareCommits({
      ...this.#repo,
      base: baseCommit,
      head: headCommit,
      per_page: 1
    });
    return data.merge_base_commit.commit;
  }
  async updateIssue(params) {
    const { data } = await this.#octokit.rest.issues.update({
      ...this.#repo,
      ...params
    });
    return data;
  }
  async createIssue(params) {
    const { data } = await this.#octokit.rest.issues.create({
      ...this.#repo,
      ...params
    });
    return data;
  }
  async createCommentOnCommit(sha, body, isReportComment) {
    const { data: comments } = await this.#octokit.rest.repos.listCommentsForCommit({
      ...this.#repo,
      commit_sha: sha
    });
    const reportComment = comments.find(
      (comment) => isReportComment(comment.body)
    );
    if (reportComment) {
      const { data: data2 } = await this.#octokit.rest.repos.updateCommitComment(
        {
          ...this.#repo,
          comment_id: reportComment.id,
          body
        }
      );
      return data2;
    }
    const { data } = await this.#octokit.rest.repos.createCommitComment({
      ...this.#repo,
      commit_sha: sha,
      body
    });
    return data;
  }
  async createCommentOnPR(prNumber, body, isReportComment) {
    let reportComment;
    let page = 1;
    while (!reportComment) {
      const { data: comments } = await this.#octokit.rest.issues.listComments({
        ...this.#repo,
        issue_number: prNumber,
        page
      });
      reportComment = comments.find(
        (comment) => comment.body && isReportComment(comment.body)
      );
      if (comments.length > 0) {
        page += 1;
      } else {
        break;
      }
    }
    if (reportComment) {
      const { data: data2 } = await this.#octokit.rest.issues.updateComment({
        ...this.#repo,
        comment_id: reportComment.id,
        body
      });
      return data2;
    }
    const { data } = await this.#octokit.rest.issues.createComment({
      ...this.#repo,
      issue_number: prNumber,
      body
    });
    return data;
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  GitHubAPI
});
//# sourceMappingURL=github-api.cjs.map
