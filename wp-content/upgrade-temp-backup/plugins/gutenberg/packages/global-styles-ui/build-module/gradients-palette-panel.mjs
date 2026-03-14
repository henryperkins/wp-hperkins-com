// packages/global-styles-ui/src/gradients-palette-panel.tsx
import { useViewportMatch } from "@wordpress/compose";
import {
  __experimentalVStack as VStack,
  __experimentalPaletteEdit as PaletteEdit,
  __experimentalSpacer as Spacer,
  DuotonePicker
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { Subtitle } from "./subtitle.mjs";
import { useSetting } from "./hooks.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var mobilePopoverProps = { placement: "bottom-start", offset: 8 };
var noop = () => {
};
function GradientPalettePanel({
  name
}) {
  const [themeGradients, setThemeGradients] = useSetting(
    "color.gradients.theme",
    name
  );
  const [baseThemeGradients] = useSetting(
    "color.gradients.theme",
    name,
    "base"
  );
  const [defaultGradients, setDefaultGradients] = useSetting(
    "color.gradients.default",
    name
  );
  const [baseDefaultGradients] = useSetting(
    "color.gradients.default",
    name,
    "base"
  );
  const [customGradients, setCustomGradients] = useSetting(
    "color.gradients.custom",
    name
  );
  const [defaultPaletteEnabled] = useSetting(
    "color.defaultGradients",
    name
  );
  const [customDuotone] = useSetting("color.duotone.custom") || [];
  const [defaultDuotone] = useSetting("color.duotone.default") || [];
  const [themeDuotone] = useSetting("color.duotone.theme") || [];
  const [defaultDuotoneEnabled] = useSetting("color.defaultDuotone");
  const duotonePalette = [
    ...customDuotone || [],
    ...themeDuotone || [],
    ...defaultDuotone && defaultDuotoneEnabled ? defaultDuotone : []
  ];
  const isMobileViewport = useViewportMatch("small", "<");
  const popoverProps = isMobileViewport ? mobilePopoverProps : void 0;
  return /* @__PURE__ */ jsxs(
    VStack,
    {
      className: "global-styles-ui-gradient-palette-panel",
      spacing: 8,
      children: [
        !!themeGradients && !!themeGradients.length && /* @__PURE__ */ jsx(
          PaletteEdit,
          {
            canReset: themeGradients !== baseThemeGradients,
            canOnlyChangeValues: true,
            gradients: themeGradients,
            onChange: setThemeGradients,
            paletteLabel: __("Theme"),
            paletteLabelHeadingLevel: 3,
            popoverProps
          }
        ),
        !!defaultGradients && !!defaultGradients.length && !!defaultPaletteEnabled && /* @__PURE__ */ jsx(
          PaletteEdit,
          {
            canReset: defaultGradients !== baseDefaultGradients,
            canOnlyChangeValues: true,
            gradients: defaultGradients,
            onChange: setDefaultGradients,
            paletteLabel: __("Default"),
            paletteLabelHeadingLevel: 3,
            popoverProps
          }
        ),
        /* @__PURE__ */ jsx(
          PaletteEdit,
          {
            gradients: customGradients,
            onChange: setCustomGradients,
            paletteLabel: __("Custom"),
            paletteLabelHeadingLevel: 3,
            slugPrefix: "custom-",
            popoverProps
          }
        ),
        !!duotonePalette && !!duotonePalette.length && /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx(Subtitle, { level: 3, children: __("Duotone") }),
          /* @__PURE__ */ jsx(Spacer, { margin: 3 }),
          /* @__PURE__ */ jsx(
            DuotonePicker,
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
export {
  GradientPalettePanel as default
};
//# sourceMappingURL=gradients-palette-panel.mjs.map
