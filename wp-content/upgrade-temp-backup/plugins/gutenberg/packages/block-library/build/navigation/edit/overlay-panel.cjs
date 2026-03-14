"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-library/src/navigation/edit/overlay-panel.js
var overlay_panel_exports = {};
__export(overlay_panel_exports, {
  default: () => OverlayPanel
});
module.exports = __toCommonJS(overlay_panel_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_overlay_template_part_selector = __toESM(require("./overlay-template-part-selector.cjs"));
var import_overlay_visibility_control = __toESM(require("./overlay-visibility-control.cjs"));
var import_overlay_menu_preview_button = __toESM(require("./overlay-menu-preview-button.cjs"));
var import_overlay_preview = __toESM(require("./overlay-preview.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
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
  const [isCreatingOverlay, setIsCreatingOverlay] = (0, import_element.useState)(false);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.PanelBody, { title: (0, import_i18n.__)("Overlay"), initialOpen: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_overlay_visibility_control.default,
      {
        overlayMenu,
        setAttributes
      }
    ),
    overlayMenu !== "never" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_overlay_menu_preview_button.default,
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
    overlayMenu !== "never" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_overlay_template_part_selector.default,
      {
        overlay,
        overlayMenu,
        setAttributes,
        onNavigateToEntityRecord,
        isCreatingOverlay,
        setIsCreatingOverlay
      }
    ),
    overlayMenu !== "never" && overlay && hasOverlays && !isCreatingOverlay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_overlay_preview.default,
      {
        overlay,
        currentTheme
      }
    )
  ] }) });
}
//# sourceMappingURL=overlay-panel.cjs.map
