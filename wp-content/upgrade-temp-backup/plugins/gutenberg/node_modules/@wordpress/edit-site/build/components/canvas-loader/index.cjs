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

// packages/edit-site/src/components/canvas-loader/index.js
var canvas_loader_exports = {};
__export(canvas_loader_exports, {
  default: () => CanvasLoader
});
module.exports = __toCommonJS(canvas_loader_exports);
var import_components = require("@wordpress/components");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_editor = require("@wordpress/editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { Theme } = (0, import_lock_unlock.unlock)(import_components.privateApis);
var { useStyle } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function CanvasLoader({ id }) {
  const textColor = useStyle("color.text");
  const backgroundColor = useStyle("color.background");
  const { elapsed, total } = (0, import_data.useSelect)((select) => {
    const selectorsByStatus = select(import_core_data.store).countSelectorsByStatus();
    const resolving = selectorsByStatus.resolving ?? 0;
    const finished = selectorsByStatus.finished ?? 0;
    return {
      elapsed: finished,
      total: finished + resolving
    };
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "edit-site-canvas-loader", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Theme, { accent: textColor, background: backgroundColor, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.ProgressBar, { id, max: total, value: elapsed }) }) });
}
//# sourceMappingURL=index.cjs.map
