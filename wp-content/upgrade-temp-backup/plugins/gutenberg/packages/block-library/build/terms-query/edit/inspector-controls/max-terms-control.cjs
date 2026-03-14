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

// packages/block-library/src/terms-query/edit/inspector-controls/max-terms-control.js
var max_terms_control_exports = {};
__export(max_terms_control_exports, {
  default: () => MaxTermsControl
});
module.exports = __toCommonJS(max_terms_control_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
function MaxTermsControl({ value, onChange, ...props }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.RangeControl,
    {
      __next40pxDefaultSize: true,
      value,
      min: 0,
      max: 100,
      onChange,
      help: (0, import_i18n.__)(
        "Limit the number of terms you want to show. To show all terms, use 0 (zero)."
      ),
      ...props
    }
  );
}
//# sourceMappingURL=max-terms-control.cjs.map
