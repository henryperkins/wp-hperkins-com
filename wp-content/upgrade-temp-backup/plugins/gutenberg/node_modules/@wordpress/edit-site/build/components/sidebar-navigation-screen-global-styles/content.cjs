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

// packages/edit-site/src/components/sidebar-navigation-screen-global-styles/content.js
var content_exports = {};
__export(content_exports, {
  default: () => SidebarNavigationScreenGlobalStylesContent
});
module.exports = __toCommonJS(content_exports);
var import_i18n = require("@wordpress/i18n");
var import_components = require("@wordpress/components");
var import_global_styles_ui = require("@wordpress/global-styles-ui");
var import_editor = require("@wordpress/editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useGlobalStyles } = (0, import_lock_unlock.unlock)(import_editor.privateApis);
function SidebarNavigationScreenGlobalStylesContent() {
  const gap = 3;
  const {
    user: userConfig,
    base: baseConfig,
    setUser: setUserConfig
  } = useGlobalStyles();
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalVStack,
    {
      spacing: 10,
      className: "edit-site-global-styles-variation-container",
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_global_styles_ui.StyleVariations,
          {
            value: userConfig,
            baseValue: baseConfig || {},
            onChange: setUserConfig,
            gap
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_global_styles_ui.ColorVariations,
          {
            value: userConfig,
            baseValue: baseConfig || {},
            onChange: setUserConfig,
            title: (0, import_i18n.__)("Palettes"),
            gap
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_global_styles_ui.TypographyVariations,
          {
            value: userConfig,
            baseValue: baseConfig || {},
            onChange: setUserConfig,
            title: (0, import_i18n.__)("Typography"),
            gap
          }
        )
      ]
    }
  );
}
//# sourceMappingURL=content.cjs.map
