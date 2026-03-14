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

// packages/core-data/src/awareness/config.ts
var config_exports = {};
__export(config_exports, {
  AWARENESS_CURSOR_UPDATE_THROTTLE_IN_MS: () => AWARENESS_CURSOR_UPDATE_THROTTLE_IN_MS,
  LOCAL_CURSOR_UPDATE_DEBOUNCE_IN_MS: () => LOCAL_CURSOR_UPDATE_DEBOUNCE_IN_MS,
  REMOVAL_DELAY_IN_MS: () => REMOVAL_DELAY_IN_MS
});
module.exports = __toCommonJS(config_exports);
var AWARENESS_CURSOR_UPDATE_THROTTLE_IN_MS = 100;
var LOCAL_CURSOR_UPDATE_DEBOUNCE_IN_MS = 5;
var REMOVAL_DELAY_IN_MS = 5e3;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AWARENESS_CURSOR_UPDATE_THROTTLE_IN_MS,
  LOCAL_CURSOR_UPDATE_DEBOUNCE_IN_MS,
  REMOVAL_DELAY_IN_MS
});
//# sourceMappingURL=config.cjs.map
