// packages/editor/src/components/more-menu/view-more-menu-group.js
import { createSlotFill } from "@wordpress/components";
import { Platform } from "@wordpress/element";
import { jsx } from "react/jsx-runtime";
var { Fill: ViewMoreMenuGroup, Slot } = createSlotFill(
  Platform.OS === "web" ? /* @__PURE__ */ Symbol("ViewMoreMenuGroup") : "ViewMoreMenuGroup"
);
ViewMoreMenuGroup.Slot = ({ fillProps }) => /* @__PURE__ */ jsx(Slot, { fillProps });
var view_more_menu_group_default = ViewMoreMenuGroup;
export {
  view_more_menu_group_default as default
};
//# sourceMappingURL=view-more-menu-group.mjs.map
