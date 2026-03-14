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

// packages/block-editor/src/components/inserter-listbox/row.js
var row_exports = {};
__export(row_exports, {
  default: () => row_default
});
module.exports = __toCommonJS(row_exports);
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
function InserterListboxRow(props, ref) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Composite.Group, { role: "presentation", ref, ...props });
}
var row_default = (0, import_element.forwardRef)(InserterListboxRow);
//# sourceMappingURL=row.cjs.map
