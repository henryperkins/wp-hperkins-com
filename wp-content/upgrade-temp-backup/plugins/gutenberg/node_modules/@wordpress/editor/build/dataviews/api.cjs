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

// packages/editor/src/dataviews/api.js
var api_exports = {};
__export(api_exports, {
  registerEntityAction: () => registerEntityAction,
  registerEntityField: () => registerEntityField,
  unregisterEntityAction: () => unregisterEntityAction,
  unregisterEntityField: () => unregisterEntityField
});
module.exports = __toCommonJS(api_exports);
var import_data = require("@wordpress/data");
var import_lock_unlock = require("../lock-unlock.cjs");
var import_store = require("../store/index.cjs");
function registerEntityAction(kind, name, config) {
  const { registerEntityAction: _registerEntityAction } = (0, import_lock_unlock.unlock)(
    (0, import_data.dispatch)(import_store.store)
  );
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    _registerEntityAction(kind, name, config);
  }
}
function unregisterEntityAction(kind, name, actionId) {
  const { unregisterEntityAction: _unregisterEntityAction } = (0, import_lock_unlock.unlock)(
    (0, import_data.dispatch)(import_store.store)
  );
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    _unregisterEntityAction(kind, name, actionId);
  }
}
function registerEntityField(kind, name, config) {
  const { registerEntityField: _registerEntityField } = (0, import_lock_unlock.unlock)(
    (0, import_data.dispatch)(import_store.store)
  );
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    _registerEntityField(kind, name, config);
  }
}
function unregisterEntityField(kind, name, fieldId) {
  const { unregisterEntityField: _unregisterEntityField } = (0, import_lock_unlock.unlock)(
    (0, import_data.dispatch)(import_store.store)
  );
  if (globalThis.IS_GUTENBERG_PLUGIN) {
    _unregisterEntityField(kind, name, fieldId);
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  registerEntityAction,
  registerEntityField,
  unregisterEntityAction,
  unregisterEntityField
});
//# sourceMappingURL=api.cjs.map
