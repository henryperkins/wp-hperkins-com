// packages/global-styles-ui/src/preset-colors.tsx
import { useStylesPreviewColors } from "./preview-hooks.mjs";
import { jsx } from "react/jsx-runtime";
function PresetColors() {
  const { paletteColors } = useStylesPreviewColors();
  return paletteColors.slice(0, 4).map(({ slug, color }, index) => /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        flexGrow: 1,
        height: "100%",
        background: color
      }
    },
    `${slug}-${index}`
  ));
}
export {
  PresetColors as default
};
//# sourceMappingURL=preset-colors.mjs.map
