// packages/sync/src/private-apis.ts
import {
  CRDT_DOC_META_PERSISTENCE_KEY,
  CRDT_RECORD_MAP_KEY,
  LOCAL_EDITOR_ORIGIN,
  LOCAL_UNDO_IGNORED_ORIGIN
} from "./config.mjs";
import { lock } from "./lock-unlock.mjs";
import { createSyncManager } from "./manager.mjs";
import { pollingManager } from "./providers/http-polling/polling-manager.mjs";
import { default as Delta } from "./quill-delta/Delta.mjs";
var privateApis = {};
lock(privateApis, {
  createSyncManager,
  Delta,
  CRDT_DOC_META_PERSISTENCE_KEY,
  CRDT_RECORD_MAP_KEY,
  LOCAL_EDITOR_ORIGIN,
  LOCAL_UNDO_IGNORED_ORIGIN,
  retrySyncConnection: () => pollingManager.retryNow()
});
export {
  privateApis
};
//# sourceMappingURL=private-apis.mjs.map
