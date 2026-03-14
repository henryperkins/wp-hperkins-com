// packages/block-library/src/post-featured-image/overlay.js
import clsx from "clsx";
import {
  withColors,
  __experimentalUseGradient,
  __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
  __experimentalUseBorderProps as useBorderProps
} from "@wordpress/block-editor";
import { compose } from "@wordpress/compose";
import { dimRatioToClass } from "./utils.mjs";
import { jsx } from "react/jsx-runtime";
var Overlay = ({ attributes, overlayColor }) => {
  const { dimRatio } = attributes;
  const { gradientClass, gradientValue } = __experimentalUseGradient();
  const colorGradientSettings = useMultipleOriginColorsAndGradients();
  const borderProps = useBorderProps(attributes);
  const overlayStyles = {
    backgroundColor: overlayColor.color,
    backgroundImage: gradientValue,
    ...borderProps.style
  };
  if (!colorGradientSettings.hasColorsOrGradients || !dimRatio) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "span",
    {
      "aria-hidden": "true",
      className: clsx(
        "wp-block-post-featured-image__overlay",
        dimRatioToClass(dimRatio),
        {
          [overlayColor.class]: overlayColor.class,
          "has-background-dim": dimRatio !== void 0,
          "has-background-gradient": gradientValue,
          [gradientClass]: gradientClass
        },
        borderProps.className
      ),
      style: overlayStyles
    }
  );
};
var overlay_default = compose([
  withColors({ overlayColor: "background-color" })
])(Overlay);
export {
  overlay_default as default
};
//# sourceMappingURL=overlay.mjs.map
