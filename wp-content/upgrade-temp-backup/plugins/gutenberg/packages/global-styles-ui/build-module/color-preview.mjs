// packages/global-styles-ui/src/color-preview.tsx
import { __experimentalHStack as HStack } from "@wordpress/components";
import { useContext } from "@wordpress/element";
import { getStyle } from "@wordpress/global-styles-engine";
import { GlobalStylesContext } from "./context.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function ColorPreview() {
  const { merged } = useContext(GlobalStylesContext);
  const backgroundColor = getStyle(merged, "color.background") || "#ffffff";
  const textColor = getStyle(merged, "color.text") || "#000000";
  const palette = merged?.settings?.color?.palette;
  let paletteColors = [];
  if (Array.isArray(palette)) {
    paletteColors = palette;
  } else if (palette && typeof palette === "object") {
    paletteColors = palette.theme || palette.custom || [];
  }
  const previewColors = paletteColors.slice(0, 4);
  return /* @__PURE__ */ jsxs(
    HStack,
    {
      spacing: 0,
      justify: "center",
      style: {
        height: "100%",
        overflow: "hidden",
        minHeight: "40px"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              backgroundColor,
              width: "25%",
              height: "100%",
              minHeight: "40px"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              backgroundColor: textColor,
              width: "25%",
              height: "100%",
              minHeight: "40px"
            }
          }
        ),
        previewColors.slice(0, 2).map((color, index) => /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              backgroundColor: color.color,
              width: "25%",
              height: "100%",
              minHeight: "40px"
            }
          },
          index
        ))
      ]
    }
  );
}
export {
  ColorPreview
};
//# sourceMappingURL=color-preview.mjs.map
