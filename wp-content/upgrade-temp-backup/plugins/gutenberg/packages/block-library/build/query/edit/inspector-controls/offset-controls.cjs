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

// packages/block-library/src/query/edit/inspector-controls/offset-controls.js
var offset_controls_exports = {};
__export(offset_controls_exports, {
  OffsetControl: () => OffsetControl,
  default: () => offset_controls_default
});
module.exports = __toCommonJS(offset_controls_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_jsx_runtime = require("react/jsx-runtime");
var MIN_OFFSET = 0;
var MAX_OFFSET = 100;
var OffsetControl = ({ offset = 0, onChange }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalNumberControl,
    {
      __next40pxDefaultSize: true,
      label: (0, import_i18n.__)("Offset"),
      value: offset,
      min: MIN_OFFSET,
      onChange: (newOffset) => {
        if (isNaN(newOffset) || newOffset < MIN_OFFSET || newOffset > MAX_OFFSET) {
          return;
        }
        onChange({ offset: newOffset });
      }
    }
  );
};
var offset_controls_default = OffsetControl;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  OffsetControl
});
//# sourceMappingURL=offset-controls.cjs.map
