// packages/global-styles-ui/src/preview-colors.tsx
import {
  __experimentalHStack as HStack,
  __unstableMotion as motion
} from "@wordpress/components";
import PresetColors from "./preset-colors.mjs";
import PreviewWrapper from "./preview-wrapper.mjs";
import { jsx } from "react/jsx-runtime";
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
var StylesPreviewColors = ({
  label,
  isFocused,
  withHoverView
}) => {
  return /* @__PURE__ */ jsx(
    PreviewWrapper,
    {
      label,
      isFocused,
      withHoverView,
      children: ({ key }) => /* @__PURE__ */ jsx(
        motion.div,
        {
          variants: firstFrameVariants,
          style: {
            height: "100%",
            overflow: "hidden"
          },
          children: /* @__PURE__ */ jsx(
            HStack,
            {
              spacing: 0,
              justify: "center",
              style: {
                height: "100%",
                overflow: "hidden"
              },
              children: /* @__PURE__ */ jsx(PresetColors, {})
            }
          )
        },
        key
      )
    }
  );
};
var preview_colors_default = StylesPreviewColors;
export {
  preview_colors_default as default
};
//# sourceMappingURL=preview-colors.mjs.map
