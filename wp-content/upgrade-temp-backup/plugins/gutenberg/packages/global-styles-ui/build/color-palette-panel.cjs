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

// packages/global-styles-ui/src/color-palette-panel.tsx
var color_palette_panel_exports = {};
__export(color_palette_panel_exports, {
  default: () => ColorPalettePanel
});
module.exports = __toCommonJS(color_palette_panel_exports);
var import_compose = require("@wordpress/compose");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_icons = require("@wordpress/icons");
var import_hooks = require("./hooks.cjs");
var import_variations_color = __toESM(require("./variations/variations-color.cjs"));
var import_jsx_runtime = require("react/jsx-runtime");
var mobilePopoverProps = { placement: "bottom-start", offset: 8 };
function ColorPalettePanel({ name }) {
  const [themeColors, setThemeColors] = (0, import_hooks.useSetting)(
    "color.palette.theme",
    name
  );
  const [baseThemeColors] = (0, import_hooks.useSetting)(
    "color.palette.theme",
    name,
    "base"
  );
  const [defaultColors, setDefaultColors] = (0, import_hooks.useSetting)(
    "color.palette.default",
    name
  );
  const [baseDefaultColors] = (0, import_hooks.useSetting)(
    "color.palette.default",
    name,
    "base"
  );
  const [customColors, setCustomColors] = (0, import_hooks.useSetting)(
    "color.palette.custom",
    name
  );
  const [defaultPaletteEnabled] = (0, import_hooks.useSetting)(
    "color.defaultPalette",
    name
  );
  const isMobileViewport = (0, import_compose.useViewportMatch)("small", "<");
  const popoverProps = isMobileViewport ? mobilePopoverProps : void 0;
  const [randomizeThemeColors] = (0, import_hooks.useColorRandomizer)(name);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { className: "global-styles-ui-color-palette-panel", spacing: 8, children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: 4, children: [
      !!themeColors && !!themeColors.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.__experimentalPaletteEdit,
        {
          canReset: themeColors !== baseThemeColors,
          canOnlyChangeValues: true,
          colors: themeColors,
          onChange: setThemeColors,
          paletteLabel: (0, import_i18n.__)("Theme"),
          paletteLabelHeadingLevel: 3,
          popoverProps
        }
      ),
      window.__experimentalEnableColorRandomizer && themeColors?.length > 0 && randomizeThemeColors && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_components.Button,
        {
          __next40pxDefaultSize: true,
          variant: "secondary",
          icon: import_icons.shuffle,
          onClick: randomizeThemeColors,
          children: (0, import_i18n.__)("Randomize colors")
        }
      )
    ] }),
    !!defaultColors && !!defaultColors.length && !!defaultPaletteEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalPaletteEdit,
      {
        canReset: defaultColors !== baseDefaultColors,
        canOnlyChangeValues: true,
        colors: defaultColors,
        onChange: setDefaultColors,
        paletteLabel: (0, import_i18n.__)("Default"),
        paletteLabelHeadingLevel: 3,
        popoverProps
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_components.__experimentalPaletteEdit,
      {
        colors: customColors,
        onChange: setCustomColors,
        paletteLabel: (0, import_i18n.__)("Custom"),
        paletteLabelHeadingLevel: 3,
        slugPrefix: "custom-",
        popoverProps
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_variations_color.default, { title: (0, import_i18n.__)("Palettes") })
  ] });
}
//# sourceMappingURL=color-palette-panel.cjs.map
