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

// packages/block-editor/src/components/inspector-controls-tabs/settings-tab.js
var settings_tab_exports = {};
__export(settings_tab_exports, {
  default: () => settings_tab_default
});
module.exports = __toCommonJS(settings_tab_exports);
var import_components = require("@wordpress/components");
var import_advanced_controls_panel = __toESM(require("./advanced-controls-panel.cjs"));
var import_position_controls_panel = __toESM(require("./position-controls-panel.cjs"));
var import_inspector_controls = __toESM(require("../inspector-controls/index.cjs"));
var import_groups = __toESM(require("../inspector-controls/groups.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var SettingsTab = ({ showAdvancedControls = false }) => {
  const defaultFills = (0, import_components.__experimentalUseSlotFills)(import_groups.default.default.name);
  const positionFills = (0, import_components.__experimentalUseSlotFills)(import_groups.default.position.name);
  const bindingsFills = (0, import_components.__experimentalUseSlotFills)(import_groups.default.bindings.name);
  const hasOtherFills = !!defaultFills?.length || !!positionFills?.length || !!bindingsFills?.length;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default.Slot, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_position_controls_panel.default, {}),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_inspector_controls.default.Slot, { group: "bindings" }),
    showAdvancedControls && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_advanced_controls_panel.default, { initialOpen: !hasOtherFills }) })
  ] });
};
var settings_tab_default = SettingsTab;
//# sourceMappingURL=settings-tab.cjs.map
