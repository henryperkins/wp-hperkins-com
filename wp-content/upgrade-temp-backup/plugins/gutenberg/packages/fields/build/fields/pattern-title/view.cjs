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

// packages/fields/src/fields/pattern-title/view.tsx
var view_exports = {};
__export(view_exports, {
  PATTERN_TYPES: () => PATTERN_TYPES,
  default: () => PatternTitleView
});
module.exports = __toCommonJS(view_exports);
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_components = require("@wordpress/components");
var import_patterns = require("@wordpress/patterns");
var import_view = require("../title/view.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { PATTERN_TYPES } = (0, import_lock_unlock.unlock)(import_patterns.privateApis);
function PatternTitleView({ item }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_view.BaseTitleView, { item, className: "fields-field__pattern-title", children: item.type === PATTERN_TYPES.theme && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.Tooltip,
    {
      placement: "top",
      text: (0, import_i18n.__)("This pattern cannot be edited."),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: import_icons.lockSmall, size: 24 })
    }
  ) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PATTERN_TYPES
});
//# sourceMappingURL=view.cjs.map
