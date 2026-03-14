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

// packages/global-styles-ui/src/gradients-palette-panel.tsx
var gradients_palette_panel_exports = {};
__export(gradients_palette_panel_exports, {
  default: () => GradientPalettePanel
});
module.exports = __toCommonJS(gradients_palette_panel_exports);
var import_compose = require("@wordpress/compose");
var import_components = require("@wordpress/components");
var import_i18n = require("@wordpress/i18n");
var import_subtitle = require("./subtitle.cjs");
var import_hooks = require("./hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var mobilePopoverProps = { placement: "bottom-start", offset: 8 };
var noop = () => {
};
function GradientPalettePanel({
  name
}) {
  const [themeGradients, setThemeGradients] = (0, import_hooks.useSetting)(
    "color.gradients.theme",
    name
  );
  const [baseThemeGradients] = (0, import_hooks.useSetting)(
    "color.gradients.theme",
    name,
    "base"
  );
  const [defaultGradients, setDefaultGradients] = (0, import_hooks.useSetting)(
    "color.gradients.default",
    name
  );
  const [baseDefaultGradients] = (0, import_hooks.useSetting)(
    "color.gradients.default",
    name,
    "base"
  );
  const [customGradients, setCustomGradients] = (0, import_hooks.useSetting)(
    "color.gradients.custom",
    name
  );
  const [defaultPaletteEnabled] = (0, import_hooks.useSetting)(
    "color.defaultGradients",
    name
  );
  const [customDuotone] = (0, import_hooks.useSetting)("color.duotone.custom") || [];
  const [defaultDuotone] = (0, import_hooks.useSetting)("color.duotone.default") || [];
  const [themeDuotone] = (0, import_hooks.useSetting)("color.duotone.theme") || [];
  const [defaultDuotoneEnabled] = (0, import_hooks.useSetting)("color.defaultDuotone");
  const duotonePalette = [
    ...customDuotone || [],
    ...themeDuotone || [],
    ...defaultDuotone && defaultDuotoneEnabled ? defaultDuotone : []
  ];
  const isMobileViewport = (0, import_compose.useViewportMatch)("small", "<");
  const popoverProps = isMobileViewport ? mobilePopoverProps : void 0;
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalVStack,
    {
      className: "global-styles-ui-gradient-palette-panel",
      spacing: 8,
      children: [
        !!themeGradients && !!themeGradients.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalPaletteEdit,
          {
            canReset: themeGradients !== baseThemeGradients,
            canOnlyChangeValues: true,
            gradients: themeGradients,
            onChange: setThemeGradients,
            paletteLabel: (0, import_i18n.__)("Theme"),
            paletteLabelHeadingLevel: 3,
            popoverProps
          }
        ),
        !!defaultGradients && !!defaultGradients.length && !!defaultPaletteEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalPaletteEdit,
          {
            canReset: defaultGradients !== baseDefaultGradients,
            canOnlyChangeValues: true,
            gradients: defaultGradients,
            onChange: setDefaultGradients,
            paletteLabel: (0, import_i18n.__)("Default"),
            paletteLabelHeadingLevel: 3,
            popoverProps
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalPaletteEdit,
          {
            gradients: customGradients,
            onChange: setCustomGradients,
            paletteLabel: (0, import_i18n.__)("Custom"),
            paletteLabelHeadingLevel: 3,
            slugPrefix: "custom-",
            popoverProps
          }
        ),
        !!duotonePalette && !!duotonePalette.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_subtitle.Subtitle, { level: 3, children: (0, import_i18n.__)("Duotone") }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalSpacer, { margin: 3 }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.DuotonePicker,
            {
              duotonePalette,
              disableCustomDuotone: true,
              disableCustomColors: true,
              clearable: false,
              onChange: noop,
              colorPalette: []
            }
          )
        ] })
      ]
    }
  );
}
//# sourceMappingURL=gradients-palette-panel.cjs.map
