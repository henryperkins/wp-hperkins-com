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

// packages/core-data/src/awareness/base-awareness.ts
var base_awareness_exports = {};
__export(base_awareness_exports, {
  BaseAwareness: () => BaseAwareness,
  BaseAwarenessState: () => BaseAwarenessState,
  baseEqualityFieldChecks: () => baseEqualityFieldChecks
});
module.exports = __toCommonJS(base_awareness_exports);
var import_data = require("@wordpress/data");
var import_awareness_state = require("./awareness-state.cjs");
var import_name = require("../name.cjs");
var import_utils = require("./utils.cjs");
var BaseAwarenessState = class extends import_awareness_state.AwarenessState {
  onSetUp() {
    void this.setCurrentCollaboratorInfo();
  }
  /**
   * Set the current collaborator info in the local state.
   */
  async setCurrentCollaboratorInfo() {
    const currentUser = await (0, import_data.resolveSelect)(import_name.STORE_NAME).getCurrentUser();
    const collaboratorInfo = (0, import_utils.generateCollaboratorInfo)(currentUser);
    this.setLocalStateField("collaboratorInfo", collaboratorInfo);
  }
};
var baseEqualityFieldChecks = {
  collaboratorInfo: import_utils.areCollaboratorInfosEqual
};
var BaseAwareness = class extends BaseAwarenessState {
  equalityFieldChecks = baseEqualityFieldChecks;
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseAwareness,
  BaseAwarenessState,
  baseEqualityFieldChecks
});
//# sourceMappingURL=base-awareness.cjs.map
