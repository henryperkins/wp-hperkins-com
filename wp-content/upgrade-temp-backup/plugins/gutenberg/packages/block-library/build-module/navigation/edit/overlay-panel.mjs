// packages/block-library/src/navigation/edit/overlay-panel.js
import {
  PanelBody,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import OverlayTemplatePartSelector from "./overlay-template-part-selector.mjs";
import OverlayVisibilityControl from "./overlay-visibility-control.mjs";
import OverlayMenuPreviewButton from "./overlay-menu-preview-button.mjs";
import OverlayPreview from "./overlay-preview.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function OverlayPanel({
  overlayMenu,
  overlay,
  setAttributes,
  onNavigateToEntityRecord,
  overlayMenuPreview,
  setOverlayMenuPreview,
  hasIcon,
  icon,
  overlayMenuPreviewClasses,
  overlayMenuPreviewId,
  isResponsive,
  currentTheme,
  hasOverlays
}) {
  const [isCreatingOverlay, setIsCreatingOverlay] = useState(false);
  return /* @__PURE__ */ jsx(PanelBody, { title: __("Overlay"), initialOpen: true, children: /* @__PURE__ */ jsxs(VStack, { spacing: 4, children: [
    /* @__PURE__ */ jsx(
      OverlayVisibilityControl,
      {
        overlayMenu,
        setAttributes
      }
    ),
    overlayMenu !== "never" && /* @__PURE__ */ jsx(
      OverlayMenuPreviewButton,
      {
        isResponsive,
        overlayMenuPreview,
        setOverlayMenuPreview,
        hasIcon,
        icon,
        setAttributes,
        overlayMenuPreviewClasses,
        overlayMenuPreviewId
      }
    ),
    overlayMenu !== "never" && /* @__PURE__ */ jsx(
      OverlayTemplatePartSelector,
      {
        overlay,
        overlayMenu,
        setAttributes,
        onNavigateToEntityRecord,
        isCreatingOverlay,
        setIsCreatingOverlay
      }
    ),
    overlayMenu !== "never" && overlay && hasOverlays && !isCreatingOverlay && /* @__PURE__ */ jsx(
      OverlayPreview,
      {
        overlay,
        currentTheme
      }
    )
  ] }) });
}
export {
  OverlayPanel as default
};
//# sourceMappingURL=overlay-panel.mjs.map
