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

// packages/global-styles-ui/src/screen-header.tsx
var screen_header_exports = {};
__export(screen_header_exports, {
  ScreenHeader: () => ScreenHeader
});
module.exports = __toCommonJS(screen_header_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_jsx_runtime = require("react/jsx-runtime");
function ScreenHeader({
  title,
  description,
  onBack
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalVStack, { spacing: 0, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalView, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { marginBottom: 0, paddingX: 4, paddingY: 3, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 2, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { spacing: 2, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Navigator.BackButton,
        {
          icon: (0, import_i18n.isRTL)() ? import_icons.chevronRight : import_icons.chevronLeft,
          size: "small",
          label: (0, import_i18n.__)("Back"),
          onClick: onBack
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.__experimentalHeading,
        {
          className: "global-styles-ui-header",
          level: 2,
          size: 13,
          children: title
        }
      ) })
    ] }),
    description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { className: "global-styles-ui-header__description", children: description })
  ] }) }) }) });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ScreenHeader
});
//# sourceMappingURL=screen-header.cjs.map
