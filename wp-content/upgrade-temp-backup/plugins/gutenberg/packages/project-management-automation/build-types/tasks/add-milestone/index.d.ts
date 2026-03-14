export = addMilestone;
/**
 * Assigns the correct milestone to PRs once merged.
 *
 * @param {WebhookPayloadPush} payload Push event payload.
 * @param {GitHub}             octokit Initialized Octokit REST client.
 */
declare function addMilestone(payload: WebhookPayloadPush, octokit: GitHub): Promise<void>;
declare namespace addMilestone {
    export { RequestError, GitHub, WebhookPayloadPush };
}
type RequestError = import("@octokit/request-error").RequestError;
type GitHub = ReturnType<typeof import("@actions/github").getOctokit>;
type WebhookPayloadPush = import("@octokit/webhooks-types").EventPayloadMap["push"];
//# sourceMappingURL=index.d.ts.map