// packages/block-library/src/navigation/edit/manage-menus-button.js
import { addQueryArgs } from "@wordpress/url";
import { Button, MenuItem } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
var ManageMenusButton = ({
  className = "",
  disabled,
  isMenuItem = false
}) => {
  let ComponentName = Button;
  if (isMenuItem) {
    ComponentName = MenuItem;
  }
  return /* @__PURE__ */ jsx(
    ComponentName,
    {
      variant: "link",
      disabled,
      className,
      href: addQueryArgs("edit.php", {
        post_type: "wp_navigation"
      }),
      children: __("Manage menus")
    }
  );
};
var manage_menus_button_default = ManageMenusButton;
export {
  manage_menus_button_default as default
};
//# sourceMappingURL=manage-menus-button.mjs.map
