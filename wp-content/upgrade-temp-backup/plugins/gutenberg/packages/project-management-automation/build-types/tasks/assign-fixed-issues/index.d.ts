export = assignFixedIssues;
/** @typedef {ReturnType<import('@actions/github').getOctokit>} GitHub */
/** @typedef {import('@octokit/webhooks-types').EventPayloadMap['pull_request']} WebhookPayloadPullRequest */
/**
 * Assigns any issues 'fixed' by a newly opened PR to the author of that PR.
 *
 * @param {WebhookPayloadPullRequest} payload Pull request event payload.
 * @param {GitHub}                    octokit Initialized Octokit REST client.
 */
declare function assignFixedIssues(payload: WebhookPayloadPullRequest, octokit: GitHub): Promise<void>;
declare namespace assignFixedIssues {
    export { GitHub, WebhookPayloadPullRequest };
}
type GitHub = ReturnType<typeof import("@actions/github").getOctokit>;
type WebhookPayloadPullRequest = import("@octokit/webhooks-types").EventPayloadMap["pull_request"];
//# sourceMappingURL=index.d.ts.map