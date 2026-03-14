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

// packages/editor/src/components/revision-created-panel/index.js
var revision_created_panel_exports = {};
__export(revision_created_panel_exports, {
  default: () => RevisionCreatedPanel
});
module.exports = __toCommonJS(revision_created_panel_exports);
var import_components = require("@wordpress/components");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_date = require("@wordpress/date");
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function RevisionCreatedPanel() {
  const date = (0, import_data.useSelect)((select) => {
    const { getCurrentRevision } = (0, import_lock_unlock.unlock)(select(import_store.store));
    return getCurrentRevision()?.date;
  }, []);
  if (!date) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-post-last-edited-panel", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { children: (0, import_i18n.sprintf)(
    // translators: %s: Human-readable time difference, e.g. "2 days ago".
    (0, import_i18n.__)("Created %s."),
    (0, import_date.humanTimeDiff)(date)
  ) }) });
}
//# sourceMappingURL=index.cjs.map
