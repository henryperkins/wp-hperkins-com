"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/sync/src/private-apis.ts
var private_apis_exports = {};
__export(private_apis_exports, {
  privateApis: () => privateApis
});
module.exports = __toCommonJS(private_apis_exports);
var import_config = require("./config.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_manager = require("./manager.cjs");
var import_polling_manager = require("./providers/http-polling/polling-manager.cjs");
var import_Delta = __toESM(require("./quill-delta/Delta.cjs"));
var privateApis = {};
(0, import_lock_unlock.lock)(privateApis, {
  createSyncManager: import_manager.createSyncManager,
  Delta: import_Delta.default,
  CRDT_DOC_META_PERSISTENCE_KEY: import_config.CRDT_DOC_META_PERSISTENCE_KEY,
  CRDT_RECORD_MAP_KEY: import_config.CRDT_RECORD_MAP_KEY,
  LOCAL_EDITOR_ORIGIN: import_config.LOCAL_EDITOR_ORIGIN,
  LOCAL_UNDO_IGNORED_ORIGIN: import_config.LOCAL_UNDO_IGNORED_ORIGIN,
  retrySyncConnection: () => import_polling_manager.pollingManager.retryNow()
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  privateApis
});
//# sourceMappingURL=private-apis.cjs.map
