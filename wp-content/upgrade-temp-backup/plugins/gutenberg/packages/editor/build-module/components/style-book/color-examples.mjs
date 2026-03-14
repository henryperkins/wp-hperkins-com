// packages/editor/src/components/style-book/color-examples.tsx
import clsx from "clsx";
import { __experimentalGrid as Grid } from "@wordpress/components";
import {
  getColorClassName,
  __experimentalGetGradientClass
} from "@wordpress/block-editor";
import { jsx } from "react/jsx-runtime";
var ColorExamples = ({
  colors,
  type,
  templateColumns = "1fr 1fr",
  itemHeight = "52px"
}) => {
  if (!colors) {
    return null;
  }
  return /* @__PURE__ */ jsx(Grid, { templateColumns, rowGap: 8, columnGap: 16, children: colors.map((color) => {
    const className = type === "gradients" ? __experimentalGetGradientClass(color.slug) : getColorClassName("background-color", color.slug);
    const classes = clsx(
      "editor-style-book__color-example",
      className
    );
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: classes,
        style: { height: itemHeight }
      },
      color.slug
    );
  }) });
};
var color_examples_default = ColorExamples;
export {
  color_examples_default as default
};
//# sourceMappingURL=color-examples.mjs.map
