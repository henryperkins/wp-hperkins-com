"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/revision-author-panel/index.js
var revision_author_panel_exports = {};
__export(revision_author_panel_exports, {
  default: () => RevisionAuthorPanel
});
module.exports = __toCommonJS(revision_author_panel_exports);
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_html_entities = require("@wordpress/html-entities");
var import_i18n = require("@wordpress/i18n");
var import_post_panel_row = __toESM(require("../post-panel-row/index.cjs"));
var import_store = require("../../store/index.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function RevisionAuthorPanel() {
  const authorName = (0, import_data.useSelect)((select) => {
    const { getCurrentRevision } = (0, import_lock_unlock.unlock)(select(import_store.store));
    const revision = getCurrentRevision();
    if (!revision?.author) {
      return null;
    }
    const author = select(import_core_data.store).getUser(revision.author);
    return author?.name;
  }, []);
  if (!authorName) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_panel_row.default, { label: (0, import_i18n.__)("Author"), children: (0, import_html_entities.decodeEntities)(authorName) });
}
//# sourceMappingURL=index.cjs.map
