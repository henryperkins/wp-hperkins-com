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

// packages/editor/src/components/pattern-overrides-panel/index.js
var pattern_overrides_panel_exports = {};
__export(pattern_overrides_panel_exports, {
  default: () => PatternOverridesPanel
});
module.exports = __toCommonJS(pattern_overrides_panel_exports);
var import_data = require("@wordpress/data");
var import_patterns = require("@wordpress/patterns");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { OverridesPanel } = (0, import_lock_unlock.unlock)(import_patterns.privateApis);
function PatternOverridesPanel() {
  const supportsPatternOverridesPanel = (0, import_data.useSelect)(
    (select) => select(import_store.store).getCurrentPostType() === "wp_block",
    []
  );
  if (!supportsPatternOverridesPanel) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverridesPanel, {});
}
//# sourceMappingURL=index.cjs.map
