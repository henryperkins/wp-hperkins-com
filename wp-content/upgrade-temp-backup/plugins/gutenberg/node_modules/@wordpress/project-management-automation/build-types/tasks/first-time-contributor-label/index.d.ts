export = firstTimeContributorLabel;
/** @typedef {ReturnType<import('@actions/github').getOctokit>} GitHub */
/** @typedef {import('@octokit/webhooks-types').EventPayloadMap['pull_request']} WebhookPayloadPullRequest */
/**
 * Assigns the first-time contributor label to PRs.
 *
 * @param {WebhookPayloadPullRequest} payload Pull request event payload.
 * @param {GitHub}                    octokit Initialized Octokit REST client.
 */
declare function firstTimeContributorLabel(payload: WebhookPayloadPullRequest, octokit: GitHub): Promise<void>;
declare namespace firstTimeContributorLabel {
    export { GitHub, WebhookPayloadPullRequest };
}
type GitHub = ReturnType<typeof import("@actions/github").getOctokit>;
type WebhookPayloadPullRequest = import("@octokit/webhooks-types").EventPayloadMap["pull_request"];
//# sourceMappingURL=index.d.ts.map