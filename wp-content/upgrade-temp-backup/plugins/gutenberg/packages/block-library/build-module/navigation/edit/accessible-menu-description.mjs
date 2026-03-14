// packages/block-library/src/navigation/edit/accessible-menu-description.js
import { useEntityProp } from "@wordpress/core-data";
import { __, sprintf } from "@wordpress/i18n";
import AccessibleDescription from "./accessible-description.mjs";
import { jsx } from "react/jsx-runtime";
function AccessibleMenuDescription({ id }) {
  const [menuTitle] = useEntityProp("postType", "wp_navigation", "title");
  const description = sprintf(__(`Navigation Menu: "%s"`), menuTitle);
  return /* @__PURE__ */ jsx(AccessibleDescription, { id, children: description });
}
export {
  AccessibleMenuDescription as default
};
//# sourceMappingURL=accessible-menu-description.mjs.map
