/**
 * Automation task function.
 */
export type WPAutomationTask = (payload: any, octokit: ReturnType<typeof getOctokit>) => void;
/**
 * Full list of automations, matched by given properties against the incoming
 * payload object.
 */
export type WPAutomation = {
    /**
     * Webhook event name to match.
     */
    event: string;
    /**
     * Action to match, if applicable.
     */
    action?: string | undefined;
    /**
     * Task to run.
     */
    task: WPAutomationTask;
};
import { getOctokit } from "@actions/github";
//# sourceMappingURL=index.d.ts.map