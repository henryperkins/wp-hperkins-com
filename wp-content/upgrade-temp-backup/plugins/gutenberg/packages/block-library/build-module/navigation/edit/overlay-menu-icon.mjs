// packages/block-library/src/navigation/edit/overlay-menu-icon.js
import { SVG, Rect } from "@wordpress/primitives";
import { Icon, menu } from "@wordpress/icons";
import { jsx, jsxs } from "react/jsx-runtime";
function OverlayMenuIcon({ icon }) {
  if (icon === "menu") {
    return /* @__PURE__ */ jsx(Icon, { icon: menu });
  }
  return /* @__PURE__ */ jsxs(
    SVG,
    {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      width: "24",
      height: "24",
      "aria-hidden": "true",
      focusable: "false",
      children: [
        /* @__PURE__ */ jsx(Rect, { x: "4", y: "7.5", width: "16", height: "1.5" }),
        /* @__PURE__ */ jsx(Rect, { x: "4", y: "15", width: "16", height: "1.5" })
      ]
    }
  );
}
export {
  OverlayMenuIcon as default
};
//# sourceMappingURL=overlay-menu-icon.mjs.map
