/**
 * Internal dependencies
 */
import { type AddAction, type AddOperationsAction, type CacheBlobUrlAction, type CancelAction, type OperationFinishAction, type OperationStartAction, type PauseItemAction, type PauseQueueAction, type QueueItem, type RemoveAction, type ResumeItemAction, type ResumeQueueAction, type RetryItemAction, type RevokeBlobUrlsAction, type State, type UnknownAction, type UpdateProgressAction, type UpdateSettingsAction } from './types';
type Action = AddAction | RemoveAction | CancelAction | RetryItemAction | PauseItemAction | ResumeItemAction | PauseQueueAction | ResumeQueueAction | AddOperationsAction | OperationFinishAction | OperationStartAction | CacheBlobUrlAction | RevokeBlobUrlsAction | UpdateProgressAction | UpdateSettingsAction | UnknownAction;
declare function reducer(state?: State, action?: Action): {
    queueStatus: string;
    queue: QueueItem[];
    blobUrls: Record<import("./types").QueueItemId, string[]>;
    settings: import("./types").Settings;
};
export default reducer;
//# sourceMappingURL=reducer.d.ts.map