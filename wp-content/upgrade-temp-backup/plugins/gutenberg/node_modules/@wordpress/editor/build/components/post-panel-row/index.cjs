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

// packages/editor/src/components/post-panel-row/index.js
var post_panel_row_exports = {};
__export(post_panel_row_exports, {
  default: () => post_panel_row_default
});
module.exports = __toCommonJS(post_panel_row_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_jsx_runtime = require("react/jsx-runtime");
var PostPanelRow = (0, import_element.forwardRef)(({ className, label, children }, ref) => {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalHStack,
    {
      className: (0, import_clsx.default)("editor-post-panel__row", className),
      ref,
      children: [
        label && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-post-panel__row-label", children: label }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "editor-post-panel__row-control", children })
      ]
    }
  );
});
var post_panel_row_default = PostPanelRow;
//# sourceMappingURL=index.cjs.map
