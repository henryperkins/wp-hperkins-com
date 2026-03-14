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

// packages/core-data/src/sync.ts
var sync_exports = {};
__export(sync_exports, {
  CRDT_DOC_META_PERSISTENCE_KEY: () => CRDT_DOC_META_PERSISTENCE_KEY,
  CRDT_RECORD_MAP_KEY: () => CRDT_RECORD_MAP_KEY,
  Delta: () => Delta,
  LOCAL_EDITOR_ORIGIN: () => LOCAL_EDITOR_ORIGIN,
  LOCAL_UNDO_IGNORED_ORIGIN: () => LOCAL_UNDO_IGNORED_ORIGIN,
  getSyncManager: () => getSyncManager,
  retrySyncConnection: () => retrySyncConnection
});
module.exports = __toCommonJS(sync_exports);
var import_sync = require("@wordpress/sync");
var import_lock_unlock = require("./lock-unlock.cjs");
var {
  createSyncManager,
  Delta,
  CRDT_DOC_META_PERSISTENCE_KEY,
  CRDT_RECORD_MAP_KEY,
  LOCAL_EDITOR_ORIGIN,
  LOCAL_UNDO_IGNORED_ORIGIN,
  retrySyncConnection
} = (0, import_lock_unlock.unlock)(import_sync.privateApis);
var syncManager;
function getSyncManager() {
  if (syncManager) {
    return syncManager;
  }
  syncManager = createSyncManager();
  return syncManager;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CRDT_DOC_META_PERSISTENCE_KEY,
  CRDT_RECORD_MAP_KEY,
  Delta,
  LOCAL_EDITOR_ORIGIN,
  LOCAL_UNDO_IGNORED_ORIGIN,
  getSyncManager,
  retrySyncConnection
});
//# sourceMappingURL=sync.cjs.map
