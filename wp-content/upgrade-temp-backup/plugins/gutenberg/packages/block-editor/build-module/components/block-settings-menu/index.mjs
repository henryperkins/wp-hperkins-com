// packages/block-editor/src/components/block-settings-menu/index.js
import { ToolbarGroup, ToolbarItem } from "@wordpress/components";
import BlockSettingsDropdown from "./block-settings-dropdown.mjs";
import CommentIconToolbarSlotFill from "../collab/block-comment-icon-toolbar-slot.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function BlockSettingsMenu({ clientIds, ...props }) {
  return /* @__PURE__ */ jsxs(ToolbarGroup, { children: [
    /* @__PURE__ */ jsx(CommentIconToolbarSlotFill.Slot, {}),
    /* @__PURE__ */ jsx(ToolbarItem, { children: (toggleProps) => /* @__PURE__ */ jsx(
      BlockSettingsDropdown,
      {
        clientIds,
        toggleProps,
        ...props
      }
    ) })
  ] });
}
var block_settings_menu_default = BlockSettingsMenu;
export {
  BlockSettingsMenu,
  block_settings_menu_default as default
};
//# sourceMappingURL=index.mjs.map
