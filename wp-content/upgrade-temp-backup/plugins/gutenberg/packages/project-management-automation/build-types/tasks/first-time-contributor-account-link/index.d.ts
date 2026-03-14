export = firstTimeContributorAccountLink;
/**
 * Prompts the user to link their GitHub account to their WordPress.org profile
 * if necessary for props credit.
 *
 * @param {WebhookPayloadPush} payload Push event payload.
 * @param {GitHub}             octokit Initialized Octokit REST client.
 */
declare function firstTimeContributorAccountLink(payload: WebhookPayloadPush, octokit: GitHub): Promise<void>;
declare namespace firstTimeContributorAccountLink {
    export { GitHub, WebhookPayloadPush, WebhookPayloadPushCommit };
}
type GitHub = ReturnType<typeof import("@actions/github").getOctokit>;
type WebhookPayloadPush = import("@octokit/webhooks-types").EventPayloadMap["push"];
type WebhookPayloadPushCommit = import("../../get-associated-pull-request").WebhookPayloadPushCommit;
//# sourceMappingURL=index.d.ts.map