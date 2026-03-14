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

// packages/editor/src/components/block-settings-menu/plugin-block-settings-menu-item.js
var plugin_block_settings_menu_item_exports = {};
__export(plugin_block_settings_menu_item_exports, {
  default: () => plugin_block_settings_menu_item_default
});
module.exports = __toCommonJS(plugin_block_settings_menu_item_exports);
var import_block_editor = require("@wordpress/block-editor");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_jsx_runtime = require("react/jsx-runtime");
var isEverySelectedBlockAllowed = (selected, allowed) => selected.filter((id) => !allowed.includes(id)).length === 0;
var shouldRenderItem = (selectedBlocks, allowedBlocks) => !Array.isArray(allowedBlocks) || isEverySelectedBlockAllowed(selectedBlocks, allowedBlocks);
var PluginBlockSettingsMenuItem = ({
  allowedBlocks,
  icon,
  label,
  onClick,
  small,
  role
}) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_block_editor.BlockSettingsMenuControls, { children: ({ selectedBlocks, onClose }) => {
  if (!shouldRenderItem(selectedBlocks, allowedBlocks)) {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.MenuItem,
    {
      onClick: (0, import_compose.compose)(onClick, onClose),
      icon,
      label: small ? label : void 0,
      role,
      children: !small && label
    }
  );
} });
var plugin_block_settings_menu_item_default = PluginBlockSettingsMenuItem;
//# sourceMappingURL=plugin-block-settings-menu-item.cjs.map
