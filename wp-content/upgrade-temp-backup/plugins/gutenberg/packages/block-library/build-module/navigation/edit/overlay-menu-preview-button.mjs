// packages/block-library/src/navigation/edit/overlay-menu-preview-button.js
import { Button, __experimentalVStack as VStack } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { Icon, close } from "@wordpress/icons";
import OverlayMenuIcon from "./overlay-menu-icon.mjs";
import OverlayMenuPreviewControls from "./overlay-menu-preview-controls.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function OverlayMenuPreviewButton({
  isResponsive,
  overlayMenuPreview,
  setOverlayMenuPreview,
  hasIcon,
  icon,
  setAttributes,
  overlayMenuPreviewClasses,
  overlayMenuPreviewId,
  containerStyle
}) {
  if (!isResponsive) {
    return null;
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        __next40pxDefaultSize: true,
        className: overlayMenuPreviewClasses,
        onClick: () => setOverlayMenuPreview(!overlayMenuPreview),
        "aria-label": __("Overlay menu controls"),
        "aria-controls": overlayMenuPreviewId,
        "aria-expanded": overlayMenuPreview,
        children: [
          hasIcon && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx(OverlayMenuIcon, { icon }),
            /* @__PURE__ */ jsx(Icon, { icon: close })
          ] }),
          !hasIcon && /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsx("span", { children: __("Menu") }),
            /* @__PURE__ */ jsx("span", { children: __("Close") })
          ] })
        ]
      }
    ),
    overlayMenuPreview && /* @__PURE__ */ jsx(
      VStack,
      {
        id: overlayMenuPreviewId,
        spacing: 4,
        style: containerStyle,
        children: /* @__PURE__ */ jsx(
          OverlayMenuPreviewControls,
          {
            hasIcon,
            icon,
            setAttributes
          }
        )
      }
    )
  ] });
}
export {
  OverlayMenuPreviewButton as default
};
//# sourceMappingURL=overlay-menu-preview-button.mjs.map
