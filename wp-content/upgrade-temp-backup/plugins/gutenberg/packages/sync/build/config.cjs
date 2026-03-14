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

// packages/sync/src/config.ts
var config_exports = {};
__export(config_exports, {
  CRDT_DOC_META_PERSISTENCE_KEY: () => CRDT_DOC_META_PERSISTENCE_KEY,
  CRDT_DOC_VERSION: () => CRDT_DOC_VERSION,
  CRDT_RECORD_MAP_KEY: () => CRDT_RECORD_MAP_KEY,
  CRDT_STATE_MAP_KEY: () => CRDT_STATE_MAP_KEY,
  CRDT_STATE_MAP_SAVED_AT_KEY: () => CRDT_STATE_MAP_SAVED_AT_KEY,
  CRDT_STATE_MAP_SAVED_BY_KEY: () => CRDT_STATE_MAP_SAVED_BY_KEY,
  CRDT_STATE_MAP_VERSION_KEY: () => CRDT_STATE_MAP_VERSION_KEY,
  LOCAL_EDITOR_ORIGIN: () => LOCAL_EDITOR_ORIGIN,
  LOCAL_SYNC_MANAGER_ORIGIN: () => LOCAL_SYNC_MANAGER_ORIGIN,
  LOCAL_UNDO_IGNORED_ORIGIN: () => LOCAL_UNDO_IGNORED_ORIGIN
});
module.exports = __toCommonJS(config_exports);
var CRDT_DOC_VERSION = 1;
var CRDT_DOC_META_PERSISTENCE_KEY = "fromPersistence";
var CRDT_RECORD_MAP_KEY = "document";
var CRDT_STATE_MAP_KEY = "state";
var CRDT_STATE_MAP_SAVED_AT_KEY = "savedAt";
var CRDT_STATE_MAP_SAVED_BY_KEY = "savedBy";
var CRDT_STATE_MAP_VERSION_KEY = "version";
var LOCAL_EDITOR_ORIGIN = "gutenberg";
var LOCAL_SYNC_MANAGER_ORIGIN = "syncManager";
var LOCAL_UNDO_IGNORED_ORIGIN = "gutenberg-undo-ignored";
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CRDT_DOC_META_PERSISTENCE_KEY,
  CRDT_DOC_VERSION,
  CRDT_RECORD_MAP_KEY,
  CRDT_STATE_MAP_KEY,
  CRDT_STATE_MAP_SAVED_AT_KEY,
  CRDT_STATE_MAP_SAVED_BY_KEY,
  CRDT_STATE_MAP_VERSION_KEY,
  LOCAL_EDITOR_ORIGIN,
  LOCAL_SYNC_MANAGER_ORIGIN,
  LOCAL_UNDO_IGNORED_ORIGIN
});
//# sourceMappingURL=config.cjs.map
