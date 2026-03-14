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

// packages/block-editor/src/components/fit-text-size-warning/index.js
var fit_text_size_warning_exports = {};
__export(fit_text_size_warning_exports, {
  default: () => FitTextSizeWarning
});
module.exports = __toCommonJS(fit_text_size_warning_exports);
var import_element = require("@wordpress/element");
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_a11y = require("@wordpress/a11y");
var import_jsx_runtime = require("react/jsx-runtime");
function FitTextSizeWarning() {
  const message = (0, import_i18n.__)(
    "The text may be too small to read. Consider using a larger container or less text."
  );
  (0, import_element.useEffect)(() => {
    (0, import_a11y.speak)(message);
  }, [message]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "block-editor-fit-text-size-warning", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Notice,
    {
      spokenMessage: null,
      status: "warning",
      isDismissible: false,
      children: message
    }
  ) });
}
//# sourceMappingURL=index.cjs.map
