// packages/block-library/src/navigation/edit/accessible-description.js
import { VisuallyHidden } from "@wordpress/components";
import { jsx } from "react/jsx-runtime";
function AccessibleDescription({ id, children }) {
  return /* @__PURE__ */ jsx(VisuallyHidden, { children: /* @__PURE__ */ jsx("div", { id, className: "wp-block-navigation__description", children }) });
}
export {
  AccessibleDescription as default
};
//# sourceMappingURL=accessible-description.mjs.map
