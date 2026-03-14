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

// packages/block-editor/src/components/image-editor/constants.js
var constants_exports = {};
__export(constants_exports, {
  MAX_ZOOM: () => MAX_ZOOM,
  MIN_ZOOM: () => MIN_ZOOM,
  POPOVER_PROPS: () => POPOVER_PROPS
});
module.exports = __toCommonJS(constants_exports);
var MIN_ZOOM = 100;
var MAX_ZOOM = 300;
var POPOVER_PROPS = {
  placement: "bottom-start"
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  MAX_ZOOM,
  MIN_ZOOM,
  POPOVER_PROPS
});
//# sourceMappingURL=constants.cjs.map
