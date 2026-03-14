// packages/block-library/src/navigation/edit/navigation-menu-name-control.js
import { TextControl } from "@wordpress/components";
import { useEntityProp } from "@wordpress/core-data";
import { __ } from "@wordpress/i18n";
import { jsx } from "react/jsx-runtime";
function NavigationMenuNameControl() {
  const [title, updateTitle] = useEntityProp(
    "postType",
    "wp_navigation",
    "title"
  );
  return /* @__PURE__ */ jsx(
    TextControl,
    {
      __next40pxDefaultSize: true,
      label: __("Menu name"),
      value: title,
      onChange: updateTitle
    }
  );
}
export {
  NavigationMenuNameControl as default
};
//# sourceMappingURL=navigation-menu-name-control.mjs.map
