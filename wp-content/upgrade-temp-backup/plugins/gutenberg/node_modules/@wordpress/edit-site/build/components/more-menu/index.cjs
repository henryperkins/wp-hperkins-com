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

// packages/edit-site/src/components/more-menu/index.js
var more_menu_exports = {};
__export(more_menu_exports, {
  default: () => MoreMenu
});
module.exports = __toCommonJS(more_menu_exports);
var import_editor = require("@wordpress/editor");
var import_site_export = __toESM(require("./site-export.cjs"));
var import_welcome_guide_menu_item = __toESM(require("./welcome-guide-menu-item.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { ToolsMoreMenuGroup, PreferencesModal } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function MoreMenu() {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ToolsMoreMenuGroup, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_site_export.default, {}),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_welcome_guide_menu_item.default, {})
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreferencesModal, {})
  ] });
}
//# sourceMappingURL=index.cjs.map
