// packages/global-styles-ui/src/preview-styles.tsx
import {
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  __unstableMotion as motion
} from "@wordpress/components";
import { useStyle } from "./hooks.mjs";
import { useStylesPreviewColors } from "./preview-hooks.mjs";
import TypographyExample from "./typography-example.mjs";
import HighlightedColors from "./highlighted-colors.mjs";
import PreviewWrapper from "./preview-wrapper.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var firstFrameVariants = {
  start: {
    scale: 1,
    opacity: 1
  },
  hover: {
    scale: 0,
    opacity: 0
  }
};
var midFrameVariants = {
  hover: {
    opacity: 1
  },
  start: {
    opacity: 0.5
  }
};
var secondFrameVariants = {
  hover: {
    scale: 1,
    opacity: 1
  },
  start: {
    scale: 0,
    opacity: 0
  }
};
function PreviewStyles({
  label,
  isFocused,
  withHoverView,
  variation
}) {
  const [fontWeight] = useStyle("typography.fontWeight");
  const [fontFamily = "serif"] = useStyle(
    "typography.fontFamily"
  );
  const [headingFontFamily = fontFamily] = useStyle(
    "elements.h1.typography.fontFamily"
  );
  const [headingFontWeight = fontWeight] = useStyle(
    "elements.h1.typography.fontWeight"
  );
  const [textColor = "black"] = useStyle("color.text");
  const [headingColor = textColor] = useStyle(
    "elements.h1.color.text"
  );
  const { paletteColors } = useStylesPreviewColors();
  return /* @__PURE__ */ jsxs(
    PreviewWrapper,
    {
      label,
      isFocused,
      withHoverView,
      children: [
        ({ ratio, key }) => /* @__PURE__ */ jsx(
          motion.div,
          {
            variants: firstFrameVariants,
            style: {
              height: "100%",
              overflow: "hidden"
            },
            children: /* @__PURE__ */ jsxs(
              HStack,
              {
                spacing: 10 * ratio,
                justify: "center",
                style: {
                  height: "100%",
                  overflow: "hidden"
                },
                children: [
                  /* @__PURE__ */ jsx(
                    TypographyExample,
                    {
                      fontSize: 65 * ratio,
                      variation
                    }
                  ),
                  /* @__PURE__ */ jsx(VStack, { spacing: 4 * ratio, children: /* @__PURE__ */ jsx(
                    HighlightedColors,
                    {
                      normalizedColorSwatchSize: 32,
                      ratio
                    }
                  ) })
                ]
              }
            )
          },
          key
        ),
        ({ key }) => /* @__PURE__ */ jsx(
          motion.div,
          {
            variants: withHoverView ? midFrameVariants : void 0,
            style: {
              height: "100%",
              width: "100%",
              position: "absolute",
              top: 0,
              overflow: "hidden",
              filter: "blur(60px)",
              opacity: 0.1
            },
            children: /* @__PURE__ */ jsx(
              HStack,
              {
                spacing: 0,
                justify: "flex-start",
                style: {
                  height: "100%",
                  overflow: "hidden"
                },
                children: paletteColors.slice(0, 4).map(({ color }, index) => /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      height: "100%",
                      background: color,
                      flexGrow: 1
                    }
                  },
                  index
                ))
              }
            )
          },
          key
        ),
        ({ ratio, key }) => /* @__PURE__ */ jsx(
          motion.div,
          {
            variants: secondFrameVariants,
            style: {
              height: "100%",
              width: "100%",
              overflow: "hidden",
              position: "absolute",
              top: 0
            },
            children: /* @__PURE__ */ jsx(
              VStack,
              {
                spacing: 3 * ratio,
                justify: "center",
                style: {
                  height: "100%",
                  overflow: "hidden",
                  padding: 10 * ratio,
                  boxSizing: "border-box"
                },
                children: label && /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      fontSize: 40 * ratio,
                      fontFamily: headingFontFamily,
                      color: headingColor,
                      fontWeight: headingFontWeight,
                      lineHeight: "1em",
                      textAlign: "center"
                    },
                    children: label
                  }
                )
              }
            )
          },
          key
        )
      ]
    }
  );
}
var preview_styles_default = PreviewStyles;
export {
  preview_styles_default as default
};
//# sourceMappingURL=preview-styles.mjs.map
