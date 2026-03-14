// packages/block-editor/src/components/block-toolbar/block-styles-dropdown.js
import { __ } from "@wordpress/i18n";
import { DropdownMenu, ToolbarGroup, ToolbarItem } from "@wordpress/components";
import BlockStylesMenu from "../block-switcher/block-styles-menu.mjs";
import { jsx } from "react/jsx-runtime";
function BlockStylesDropdown({
  clientIds,
  children,
  label,
  text
}) {
  return /* @__PURE__ */ jsx(ToolbarGroup, { children: /* @__PURE__ */ jsx(ToolbarItem, { children: (toggleProps) => /* @__PURE__ */ jsx(
    DropdownMenu,
    {
      className: "block-editor-block-switcher",
      label,
      popoverProps: {
        placement: "bottom-start",
        className: "block-editor-block-switcher__popover"
      },
      icon: children,
      text,
      toggleProps: {
        description: __("Change block style"),
        ...toggleProps
      },
      menuProps: { orientation: "both" },
      children: ({ onClose }) => /* @__PURE__ */ jsx("div", { className: "block-editor-block-switcher__container", children: /* @__PURE__ */ jsx(
        BlockStylesMenu,
        {
          hoveredBlock: {
            clientId: clientIds[0]
          },
          onSwitch: onClose
        }
      ) })
    }
  ) }) });
}
export {
  BlockStylesDropdown as default
};
//# sourceMappingURL=block-styles-dropdown.mjs.map
