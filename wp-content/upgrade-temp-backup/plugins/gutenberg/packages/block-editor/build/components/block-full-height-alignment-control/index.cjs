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

// packages/block-editor/src/components/block-full-height-alignment-control/index.js
var block_full_height_alignment_control_exports = {};
__export(block_full_height_alignment_control_exports, {
  default: () => block_full_height_alignment_control_default
});
module.exports = __toCommonJS(block_full_height_alignment_control_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_icons = require("@wordpress/icons");
var import_jsx_runtime = require("react/jsx-runtime");
function BlockFullHeightAlignmentControl({
  isActive,
  label = (0, import_i18n.__)("Full height"),
  onToggle,
  isDisabled
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.ToolbarButton,
    {
      isActive,
      icon: import_icons.fullHeight,
      label,
      onClick: () => onToggle(!isActive),
      disabled: isDisabled
    }
  );
}
var block_full_height_alignment_control_default = BlockFullHeightAlignmentControl;
//# sourceMappingURL=index.cjs.map
