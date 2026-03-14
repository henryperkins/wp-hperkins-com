// packages/global-styles-ui/src/font-sizes/font-size-preview.tsx
import { getComputedFluidTypographyValue } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { useStyle } from "../hooks.mjs";
import { jsx } from "react/jsx-runtime";
function FontSizePreview({ fontSize }) {
  const [font] = useStyle("typography");
  const input = typeof fontSize?.fluid === "object" && fontSize?.fluid?.min && fontSize?.fluid?.max ? {
    minimumFontSize: fontSize.fluid.min,
    maximumFontSize: fontSize.fluid.max
  } : {
    fontSize: fontSize.size
  };
  const computedFontSize = getComputedFluidTypographyValue(input);
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "global-styles-ui-typography-preview",
      style: {
        fontSize: computedFontSize,
        fontFamily: font?.fontFamily ?? "serif"
      },
      children: __("Aa")
    }
  );
}
var font_size_preview_default = FontSizePreview;
export {
  font_size_preview_default as default
};
//# sourceMappingURL=font-size-preview.mjs.map
