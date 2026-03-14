// packages/global-styles-ui/src/preview-typography.tsx
import { __experimentalHStack as HStack } from "@wordpress/components";
import TypographyExample from "./typography-example.mjs";
import PreviewWrapper from "./preview-wrapper.mjs";
import { jsx } from "react/jsx-runtime";
var StylesPreviewTypography = ({
  variation,
  isFocused,
  withHoverView
}) => {
  return /* @__PURE__ */ jsx(
    PreviewWrapper,
    {
      label: variation.title,
      isFocused,
      withHoverView,
      children: ({ ratio, key }) => /* @__PURE__ */ jsx(
        HStack,
        {
          spacing: 10 * ratio,
          justify: "center",
          style: {
            height: "100%",
            overflow: "hidden"
          },
          children: /* @__PURE__ */ jsx(
            TypographyExample,
            {
              variation,
              fontSize: 85 * ratio
            }
          )
        },
        key
      )
    }
  );
};
var preview_typography_default = StylesPreviewTypography;
export {
  preview_typography_default as default
};
//# sourceMappingURL=preview-typography.mjs.map
