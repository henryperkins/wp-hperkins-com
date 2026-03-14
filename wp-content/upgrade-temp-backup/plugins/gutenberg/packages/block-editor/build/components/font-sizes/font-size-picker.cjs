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

// packages/block-editor/src/components/font-sizes/font-size-picker.js
var font_size_picker_exports = {};
__export(font_size_picker_exports, {
  default: () => font_size_picker_default
});
module.exports = __toCommonJS(font_size_picker_exports);
var import_components = require("@wordpress/components");
var import_use_settings = require("../use-settings/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function FontSizePicker(props) {
  const [fontSizes, customFontSize] = (0, import_use_settings.useSettings)(
    "typography.fontSizes",
    "typography.customFontSize"
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.FontSizePicker,
    {
      ...props,
      fontSizes,
      disableCustomFontSizes: !customFontSize,
      __next40pxDefaultSize: true
    }
  );
}
var font_size_picker_default = FontSizePicker;
//# sourceMappingURL=font-size-picker.cjs.map
