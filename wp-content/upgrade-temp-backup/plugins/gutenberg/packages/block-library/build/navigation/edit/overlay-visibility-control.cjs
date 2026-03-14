"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/block-library/src/navigation/edit/overlay-visibility-control.js
var overlay_visibility_control_exports = {};
__export(overlay_visibility_control_exports, {
  default: () => OverlayVisibilityControl
});
module.exports = __toCommonJS(overlay_visibility_control_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_jsx_runtime = require("react/jsx-runtime");
function OverlayVisibilityControl({
  overlayMenu,
  setAttributes
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalToggleGroupControl,
    {
      __next40pxDefaultSize: true,
      label: (0, import_i18n.__)("Overlay Visibility"),
      "aria-label": (0, import_i18n.__)("Configure overlay visibility"),
      value: overlayMenu,
      help: (0, import_i18n.__)(
        "Collapses the navigation options in a menu icon opening an overlay."
      ),
      onChange: (value) => setAttributes({ overlayMenu: value }),
      isBlock: true,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalToggleGroupControlOption, { value: "never", label: (0, import_i18n.__)("Off") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalToggleGroupControlOption, { value: "mobile", label: (0, import_i18n.__)("Mobile") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalToggleGroupControlOption, { value: "always", label: (0, import_i18n.__)("Always") })
      ]
    }
  );
}
//# sourceMappingURL=overlay-visibility-control.cjs.map
