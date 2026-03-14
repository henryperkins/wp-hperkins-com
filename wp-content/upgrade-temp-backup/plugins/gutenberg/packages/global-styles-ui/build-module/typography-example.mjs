// packages/global-styles-ui/src/typography-example.tsx
import { useContext } from "@wordpress/element";
import { __unstableMotion as motion } from "@wordpress/components";
import { _x } from "@wordpress/i18n";
import { GlobalStylesContext } from "./context.mjs";
import { getFamilyPreviewStyle } from "./font-library/utils/preview-styles.mjs";
import { getFontFamilies } from "./utils.mjs";
import { useStyle } from "./hooks.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function PreviewTypography({
  fontSize,
  variation
}) {
  const { base } = useContext(GlobalStylesContext);
  let config = base;
  if (variation) {
    config = { ...base, ...variation };
  }
  const [textColor] = useStyle("color.text");
  const [bodyFontFamilies, headingFontFamilies] = getFontFamilies(config);
  const bodyPreviewStyle = bodyFontFamilies ? getFamilyPreviewStyle(bodyFontFamilies) : {};
  const headingPreviewStyle = headingFontFamilies ? getFamilyPreviewStyle(headingFontFamilies) : {};
  if (textColor) {
    bodyPreviewStyle.color = textColor;
    headingPreviewStyle.color = textColor;
  }
  if (fontSize) {
    bodyPreviewStyle.fontSize = fontSize;
    headingPreviewStyle.fontSize = fontSize;
  }
  return /* @__PURE__ */ jsxs(
    motion.div,
    {
      animate: {
        scale: 1,
        opacity: 1
      },
      initial: {
        scale: 0.1,
        opacity: 0
      },
      transition: {
        delay: 0.3,
        type: "tween"
      },
      style: {
        textAlign: "center",
        lineHeight: 1
      },
      children: [
        /* @__PURE__ */ jsx("span", { style: headingPreviewStyle, children: _x("A", "Uppercase letter A") }),
        /* @__PURE__ */ jsx("span", { style: bodyPreviewStyle, children: _x("a", "Lowercase letter A") })
      ]
    }
  );
}
export {
  PreviewTypography as default
};
//# sourceMappingURL=typography-example.mjs.map
