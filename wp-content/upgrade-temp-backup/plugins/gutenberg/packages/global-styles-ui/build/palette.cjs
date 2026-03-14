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

// packages/global-styles-ui/src/palette.tsx
var palette_exports = {};
__export(palette_exports, {
  default: () => palette_default
});
module.exports = __toCommonJS(palette_exports);
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_element = require("@wordpress/element");
var import_subtitle = require("./subtitle.cjs");
var import_navigation_button = require("./navigation-button.cjs");
var import_color_indicator_wrapper = __toESM(require("./color-indicator-wrapper.cjs"));
var import_hooks = require("./hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var EMPTY_COLORS = [];
function Palette({ name }) {
  const [customColors] = (0, import_hooks.useSetting)("color.palette.custom");
  const [themeColors] = (0, import_hooks.useSetting)("color.palette.theme");
  const [defaultColors] = (0, import_hooks.useSetting)("color.palette.default");
  const [defaultPaletteEnabled] = (0, import_hooks.useSetting)(
    "color.defaultPalette",
    name
  );
  const safeCustomColors = customColors || EMPTY_COLORS;
  const safeThemeColors = themeColors || EMPTY_COLORS;
  const safeDefaultColors = defaultColors || EMPTY_COLORS;
  const safeDefaultPaletteEnabled = defaultPaletteEnabled ?? true;
  const colors = (0, import_element.useMemo)(
    () => [
      ...safeCustomColors,
      ...safeThemeColors,
      ...safeDefaultColors && safeDefaultPaletteEnabled ? safeDefaultColors : EMPTY_COLORS
    ],
    [
      safeCustomColors,
      safeThemeColors,
      safeDefaultColors,
      safeDefaultPaletteEnabled
    ]
  );
  const screenPath = !name ? "/colors/palette" : "/blocks/" + encodeURIComponent(name) + "/colors/palette";
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 3, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_subtitle.Subtitle, { level: 3, children: (0, import_i18n.__)("Palette") }),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalItemGroup, { isBordered: true, isSeparated: true, children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_navigation_button.NavigationButtonAsItem, { path: screenPath, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { direction: "row", children: [
      colors.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalZStack, { isLayered: false, offset: -8, children: colors.slice(0, 5).map(({ color }, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_color_indicator_wrapper.default,
          {
            children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
              import_components.ColorIndicator,
              {
                colorValue: color
              }
            )
          },
          `${color}-${index}`
        )) }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { isBlock: true, children: (0, import_i18n.__)("Edit palette") })
      ] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.FlexItem, { children: (0, import_i18n.__)("Add colors") }),
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_icons.Icon, { icon: (0, import_i18n.isRTL)() ? import_icons.chevronLeft : import_icons.chevronRight })
    ] }) }) })
  ] });
}
var palette_default = Palette;
//# sourceMappingURL=palette.cjs.map
