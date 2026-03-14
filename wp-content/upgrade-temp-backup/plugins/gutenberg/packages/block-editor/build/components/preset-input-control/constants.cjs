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

// packages/block-editor/src/components/preset-input-control/constants.js
var constants_exports = {};
__export(constants_exports, {
  CUSTOM_VALUE_SETTINGS: () => CUSTOM_VALUE_SETTINGS,
  ICON_SIZE: () => ICON_SIZE,
  RANGE_CONTROL_MAX_SIZE: () => RANGE_CONTROL_MAX_SIZE
});
module.exports = __toCommonJS(constants_exports);
var ICON_SIZE = 24;
var RANGE_CONTROL_MAX_SIZE = 8;
var CUSTOM_VALUE_SETTINGS = {
  px: { max: 300, steps: 1 },
  "%": { max: 100, steps: 1 },
  vw: { max: 100, steps: 1 },
  vh: { max: 100, steps: 1 },
  em: { max: 10, steps: 0.1 },
  rem: { max: 10, steps: 0.1 },
  svw: { max: 100, steps: 1 },
  lvw: { max: 100, steps: 1 },
  dvw: { max: 100, steps: 1 },
  svh: { max: 100, steps: 1 },
  lvh: { max: 100, steps: 1 },
  dvh: { max: 100, steps: 1 },
  vi: { max: 100, steps: 1 },
  svi: { max: 100, steps: 1 },
  lvi: { max: 100, steps: 1 },
  dvi: { max: 100, steps: 1 },
  vb: { max: 100, steps: 1 },
  svb: { max: 100, steps: 1 },
  lvb: { max: 100, steps: 1 },
  dvb: { max: 100, steps: 1 },
  vmin: { max: 100, steps: 1 },
  svmin: { max: 100, steps: 1 },
  lvmin: { max: 100, steps: 1 },
  dvmin: { max: 100, steps: 1 },
  vmax: { max: 100, steps: 1 },
  svmax: { max: 100, steps: 1 },
  lvmax: { max: 100, steps: 1 },
  dvmax: { max: 100, steps: 1 }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CUSTOM_VALUE_SETTINGS,
  ICON_SIZE,
  RANGE_CONTROL_MAX_SIZE
});
//# sourceMappingURL=constants.cjs.map
