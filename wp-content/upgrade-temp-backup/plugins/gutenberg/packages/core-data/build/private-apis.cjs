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

// packages/core-data/src/private-apis.js
var private_apis_exports = {};
__export(private_apis_exports, {
  privateApis: () => privateApis
});
module.exports = __toCommonJS(private_apis_exports);
var import_use_entity_records = require("./hooks/use-entity-records.cjs");
var import_utils = require("./utils/index.cjs");
var import_use_post_editor_awareness_state = require("./hooks/use-post-editor-awareness-state.cjs");
var import_lock_unlock = require("./lock-unlock.cjs");
var import_sync = require("./sync.cjs");
var privateApis = {};
(0, import_lock_unlock.lock)(privateApis, {
  useEntityRecordsWithPermissions: import_use_entity_records.useEntityRecordsWithPermissions,
  RECEIVE_INTERMEDIATE_RESULTS: import_utils.RECEIVE_INTERMEDIATE_RESULTS,
  retrySyncConnection: import_sync.retrySyncConnection,
  useActiveCollaborators: import_use_post_editor_awareness_state.useActiveCollaborators,
  useResolvedSelection: import_use_post_editor_awareness_state.useResolvedSelection,
  useLastPostSave: import_use_post_editor_awareness_state.useLastPostSave
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  privateApis
});
//# sourceMappingURL=private-apis.cjs.map
