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

// packages/edit-site/src/deprecated.js
var deprecated_exports = {};
__export(deprecated_exports, {
  PluginMoreMenuItem: () => PluginMoreMenuItem,
  PluginSidebar: () => PluginSidebar,
  PluginSidebarMoreMenuItem: () => PluginSidebarMoreMenuItem
});
module.exports = __toCommonJS(deprecated_exports);
var import_editor = require("@wordpress/editor");
var import_url = require("@wordpress/url");
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_jsx_runtime = require("react/jsx-runtime");
var isSiteEditor = (0, import_url.getPath)(window.location.href)?.includes(
  "site-editor.php"
);
var deprecateSlot = (name) => {
  (0, import_deprecated.default)(`wp.editPost.${name}`, {
    since: "6.6",
    alternative: `wp.editor.${name}`
  });
};
function PluginMoreMenuItem(props) {
  if (!isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginMoreMenuItem");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.PluginMoreMenuItem, { ...props });
}
function PluginSidebar(props) {
  if (!isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginSidebar");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.PluginSidebar, { ...props });
}
function PluginSidebarMoreMenuItem(props) {
  if (!isSiteEditor) {
    return null;
  }
  deprecateSlot("PluginSidebarMoreMenuItem");
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.PluginSidebarMoreMenuItem, { ...props });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  PluginMoreMenuItem,
  PluginSidebar,
  PluginSidebarMoreMenuItem
});
//# sourceMappingURL=deprecated.cjs.map
