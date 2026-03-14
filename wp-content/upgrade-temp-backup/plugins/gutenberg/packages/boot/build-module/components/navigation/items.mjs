// packages/boot/src/components/navigation/items.tsx
import { isValidElement } from "@wordpress/element";
import { Dashicon, Icon } from "@wordpress/components";
import { SVG } from "@wordpress/primitives";
import { jsx } from "react/jsx-runtime";
function isSvg(element) {
  return isValidElement(element) && (element.type === SVG || element.type === "svg");
}
function wrapIcon(icon, shouldShowPlaceholder = true) {
  if (isSvg(icon)) {
    return /* @__PURE__ */ jsx(Icon, { icon });
  }
  if (typeof icon === "string" && icon.startsWith("dashicons-")) {
    const iconKey = icon.replace(
      /^dashicons-/,
      ""
    );
    return /* @__PURE__ */ jsx(
      Dashicon,
      {
        style: { padding: "2px" },
        icon: iconKey,
        "aria-hidden": "true"
      }
    );
  }
  if (typeof icon === "string" && icon.startsWith("data:")) {
    return /* @__PURE__ */ jsx(
      "img",
      {
        src: icon,
        alt: "",
        "aria-hidden": "true",
        style: {
          width: "20px",
          height: "20px",
          display: "block",
          padding: "2px"
        }
      }
    );
  }
  if (icon) {
    return icon;
  }
  if (shouldShowPlaceholder) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        style: { width: "24px", height: "24px" },
        "aria-hidden": "true"
      }
    );
  }
  return null;
}
export {
  wrapIcon
};
//# sourceMappingURL=items.mjs.map
