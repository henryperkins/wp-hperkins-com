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

// packages/global-styles-ui/src/font-library/google-fonts-confirm-dialog.tsx
var google_fonts_confirm_dialog_exports = {};
__export(google_fonts_confirm_dialog_exports, {
  default: () => google_fonts_confirm_dialog_default
});
module.exports = __toCommonJS(google_fonts_confirm_dialog_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_jsx_runtime = require("react/jsx-runtime");
function GoogleFontsConfirmDialog() {
  const handleConfirm = () => {
    window.localStorage.setItem(
      "wp-font-library-google-fonts-permission",
      "true"
    );
    window.dispatchEvent(new Event("storage"));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "font-library__google-fonts-confirm", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.CardBody, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalHeading, { level: 2, children: (0, import_i18n.__)("Connect to Google Fonts") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 6 }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { as: "p", children: (0, import_i18n.__)(
      "To install fonts from Google you must give permission to connect directly to Google servers. The fonts you install will be downloaded from Google and stored on your site. Your site will then use these locally-hosted fonts."
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 3 }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { as: "p", children: (0, import_i18n.__)(
      "You can alternatively upload files directly on the Upload tab."
    ) }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 6 }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.Button,
      {
        __next40pxDefaultSize: true,
        variant: "primary",
        onClick: handleConfirm,
        children: (0, import_i18n.__)("Allow access to Google Fonts")
      }
    )
  ] }) }) });
}
var google_fonts_confirm_dialog_default = GoogleFontsConfirmDialog;
//# sourceMappingURL=google-fonts-confirm-dialog.cjs.map
