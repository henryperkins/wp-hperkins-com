// packages/edit-widgets/src/components/more-menu/tools-more-menu-group.js
import { createSlotFill } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
var { Fill: ToolsMoreMenuGroup, Slot } = createSlotFill(
  "EditWidgetsToolsMoreMenuGroup"
);
ToolsMoreMenuGroup.Slot = ({ fillProps }) => /* @__PURE__ */ jsx(Slot, { fillProps, children: (fills) => fills.length > 0 && fills });
var tools_more_menu_group_default = ToolsMoreMenuGroup;
export {
  tools_more_menu_group_default as default
};
//# sourceMappingURL=tools-more-menu-group.mjs.map
