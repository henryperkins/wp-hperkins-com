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

// packages/edit-site/src/components/site-editor-routes/attachment-item.js
var attachment_item_exports = {};
__export(attachment_item_exports, {
  attachmentItemRoute: () => attachmentItemRoute
});
module.exports = __toCommonJS(attachment_item_exports);
var import_i18n = require("@wordpress/i18n");
var import_editor = __toESM(require("../editor/index.cjs"));
var import_sidebar_navigation_screen = __toESM(require("../sidebar-navigation-screen/index.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var attachmentItemRoute = {
  name: "attachment-item",
  path: "/attachment/:postId",
  areas: {
    sidebar: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_sidebar_navigation_screen.default,
      {
        title: (0, import_i18n.__)("Media"),
        backPath: "/",
        content: null
      }
    ),
    mobile: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.default, {}),
    preview: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_editor.default, {})
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  attachmentItemRoute
});
//# sourceMappingURL=attachment-item.cjs.map
