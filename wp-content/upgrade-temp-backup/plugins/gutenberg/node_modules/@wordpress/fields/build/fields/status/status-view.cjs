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

// packages/fields/src/fields/status/status-view.tsx
var status_view_exports = {};
__export(status_view_exports, {
  default: () => status_view_default
});
module.exports = __toCommonJS(status_view_exports);
var import_components = require("@wordpress/components");
var import_status_elements = __toESM(require("./status-elements.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function StatusView({ item }) {
  const status = import_status_elements.default.find(({ value }) => value === item.status);
  const label = status?.label || item.status;
  const icon = status?.icon;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { alignment: "left", spacing: 0, children: [
    icon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "fields-controls__status-icon", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Icon, { icon }) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })
  ] });
}
var status_view_default = StatusView;
//# sourceMappingURL=status-view.cjs.map
