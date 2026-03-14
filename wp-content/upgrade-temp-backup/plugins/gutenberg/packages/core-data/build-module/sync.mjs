// packages/core-data/src/sync.ts
import {
  privateApis as syncPrivateApis
} from "@wordpress/sync";
import { unlock } from "./lock-unlock.mjs";
var {
  createSyncManager,
  Delta,
  CRDT_DOC_META_PERSISTENCE_KEY,
  CRDT_RECORD_MAP_KEY,
  LOCAL_EDITOR_ORIGIN,
  LOCAL_UNDO_IGNORED_ORIGIN,
  retrySyncConnection
} = unlock(syncPrivateApis);
var syncManager;
function getSyncManager() {
  if (syncManager) {
    return syncManager;
  }
  syncManager = createSyncManager();
  return syncManager;
}
export {
  CRDT_DOC_META_PERSISTENCE_KEY,
  CRDT_RECORD_MAP_KEY,
  Delta,
  LOCAL_EDITOR_ORIGIN,
  LOCAL_UNDO_IGNORED_ORIGIN,
  getSyncManager,
  retrySyncConnection
};
//# sourceMappingURL=sync.mjs.map
