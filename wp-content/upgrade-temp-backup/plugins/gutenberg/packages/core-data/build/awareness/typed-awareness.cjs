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

// packages/core-data/src/awareness/typed-awareness.ts
var typed_awareness_exports = {};
__export(typed_awareness_exports, {
  TypedAwareness: () => TypedAwareness
});
module.exports = __toCommonJS(typed_awareness_exports);
var import_sync = require("@wordpress/sync");
var import_utils = require("./utils.cjs");
var TypedAwareness = class extends import_sync.Awareness {
  /**
   * Get the states from an awareness document.
   */
  getStates() {
    return super.getStates();
  }
  /**
   * Get a local state field from an awareness document.
   * @param field
   */
  getLocalStateField(field) {
    const state = this.getLocalState();
    return (0, import_utils.getRecordValue)(state, field);
  }
  /**
   * Set a local state field on an awareness document.
   * @param field
   * @param value
   */
  setLocalStateField(field, value) {
    super.setLocalStateField(field, value);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TypedAwareness
});
//# sourceMappingURL=typed-awareness.cjs.map
