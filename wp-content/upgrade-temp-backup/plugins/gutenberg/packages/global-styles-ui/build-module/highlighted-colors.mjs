// packages/global-styles-ui/src/highlighted-colors.tsx
import { __unstableMotion as motion } from "@wordpress/components";
import { useStylesPreviewColors } from "./preview-hooks.mjs";
import { jsx } from "react/jsx-runtime";
function HighlightedColors({
  normalizedColorSwatchSize,
  ratio
}) {
  const { highlightedColors } = useStylesPreviewColors();
  const scaledSwatchSize = normalizedColorSwatchSize * ratio;
  return highlightedColors.map(({ slug, color }, index) => /* @__PURE__ */ jsx(
    motion.div,
    {
      style: {
        height: scaledSwatchSize,
        width: scaledSwatchSize,
        background: color,
        borderRadius: scaledSwatchSize / 2
      },
      animate: {
        scale: 1,
        opacity: 1
      },
      initial: {
        scale: 0.1,
        opacity: 0
      },
      transition: {
        delay: index === 1 ? 0.2 : 0.1
      }
    },
    `${slug}-${index}`
  ));
}
export {
  HighlightedColors as default
};
//# sourceMappingURL=highlighted-colors.mjs.map
