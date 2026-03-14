// packages/editor/src/components/block-settings-menu/plugin-block-settings-menu-item.js
import { BlockSettingsMenuControls } from "@wordpress/block-editor";
import { MenuItem } from "@wordpress/components";
import { compose } from "@wordpress/compose";
import { jsx } from "react/jsx-runtime";
var isEverySelectedBlockAllowed = (selected, allowed) => selected.filter((id) => !allowed.includes(id)).length === 0;
var shouldRenderItem = (selectedBlocks, allowedBlocks) => !Array.isArray(allowedBlocks) || isEverySelectedBlockAllowed(selectedBlocks, allowedBlocks);
var PluginBlockSettingsMenuItem = ({
  allowedBlocks,
  icon,
  label,
  onClick,
  small,
  role
}) => /* @__PURE__ */ jsx(BlockSettingsMenuControls, { children: ({ selectedBlocks, onClose }) => {
  if (!shouldRenderItem(selectedBlocks, allowedBlocks)) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    MenuItem,
    {
      onClick: compose(onClick, onClose),
      icon,
      label: small ? label : void 0,
      role,
      children: !small && label
    }
  );
} });
var plugin_block_settings_menu_item_default = PluginBlockSettingsMenuItem;
export {
  plugin_block_settings_menu_item_default as default
};
//# sourceMappingURL=plugin-block-settings-menu-item.mjs.map
