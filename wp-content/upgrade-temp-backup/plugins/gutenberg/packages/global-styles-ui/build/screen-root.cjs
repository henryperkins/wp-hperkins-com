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

// packages/global-styles-ui/src/screen-root.tsx
var screen_root_exports = {};
__export(screen_root_exports, {
  default: () => screen_root_default
});
module.exports = __toCommonJS(screen_root_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_data = require("@wordpress/data");
var import_core_data = require("@wordpress/core-data");
var import_icon_with_current_color = require("./icon-with-current-color.cjs");
var import_navigation_button = require("./navigation-button.cjs");
var import_root_menu = __toESM(require("./root-menu.cjs"));
var import_preview_styles = __toESM(require("./preview-styles.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
function ScreenRoot() {
  const hasVariations = (0, import_data.useSelect)((select) => {
    const { __experimentalGetCurrentThemeGlobalStylesVariations } = select(import_core_data.store);
    return !!__experimentalGetCurrentThemeGlobalStylesVariations()?.length;
  }, []);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.Card,
    {
      size: "small",
      isBorderless: true,
      className: "global-styles-ui-screen-root",
      isRounded: false,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.CardBody, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.Card, { className: "global-styles-ui-screen-root__active-style-tile", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.CardMedia, { className: "global-styles-ui-screen-root__active-style-tile-preview", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_preview_styles.default, {}) }) }),
          hasVariations && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_navigation_button.NavigationButtonAsItem, { path: "/variations", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "space-between", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: (0, import_i18n.__)("Browse styles") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_icon_with_current_color.IconWithCurrentColor,
              {
                icon: (0, import_i18n.isRTL)() ? import_icons.chevronLeft : import_icons.chevronRight
              }
            )
          ] }) }) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_root_menu.default, {})
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.CardDivider, {}),
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.CardBody, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.__experimentalSpacer,
            {
              as: "p",
              paddingTop: 2,
              paddingX: "13px",
              marginBottom: 4,
              children: (0, import_i18n.__)(
                "Customize the appearance of specific blocks for the whole site."
              )
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_navigation_button.NavigationButtonAsItem, { path: "/blocks", children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { justify: "space-between", children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: (0, import_i18n.__)("Blocks") }),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_icon_with_current_color.IconWithCurrentColor,
              {
                icon: (0, import_i18n.isRTL)() ? import_icons.chevronLeft : import_icons.chevronRight
              }
            )
          ] }) }) })
        ] })
      ]
    }
  );
}
var screen_root_default = ScreenRoot;
//# sourceMappingURL=screen-root.cjs.map
