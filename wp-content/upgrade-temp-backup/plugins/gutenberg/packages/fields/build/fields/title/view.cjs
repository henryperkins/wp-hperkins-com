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

// packages/fields/src/fields/title/view.tsx
var view_exports = {};
__export(view_exports, {
  BaseTitleView: () => BaseTitleView,
  default: () => TitleView
});
module.exports = __toCommonJS(view_exports);
var import_clsx = __toESM(require("clsx"));
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_utils = require("../../actions/utils.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function BaseTitleView({
  item,
  className,
  children
}) {
  const renderedTitle = (0, import_utils.getItemTitle)(item);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalHStack,
    {
      className: (0, import_clsx.default)("fields-field__title", className),
      alignment: "center",
      justify: "flex-start",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: renderedTitle || (0, import_i18n.__)("(no title)") }),
        children
      ]
    }
  );
}
function TitleView({ item }) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BaseTitleView, { item });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BaseTitleView
});
//# sourceMappingURL=view.cjs.map
