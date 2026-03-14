// packages/global-styles-ui/src/preview-wrapper.tsx
import { __unstableMotion as motion } from "@wordpress/components";
import {
  useThrottle,
  useReducedMotion,
  useResizeObserver
} from "@wordpress/compose";
import { useLayoutEffect, useState } from "@wordpress/element";
import { useStyle } from "./hooks.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var normalizedWidth = 248;
var normalizedHeight = 152;
var THROTTLE_OPTIONS = {
  leading: true,
  trailing: true
};
function PreviewWrapper({
  children,
  label,
  isFocused,
  withHoverView
}) {
  const [backgroundColor = "white"] = useStyle("color.background");
  const [gradientValue] = useStyle("color.gradient");
  const disableMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const [containerResizeListener, { width }] = useResizeObserver();
  const [throttledWidth, setThrottledWidthState] = useState(width);
  const [ratioState, setRatioState] = useState();
  const setThrottledWidth = useThrottle(
    setThrottledWidthState,
    250,
    THROTTLE_OPTIONS
  );
  useLayoutEffect(() => {
    if (width) {
      setThrottledWidth(width);
    }
  }, [width, setThrottledWidth]);
  useLayoutEffect(() => {
    const newRatio = throttledWidth ? throttledWidth / normalizedWidth : 1;
    const ratioDiff = newRatio - (ratioState || 0);
    const isRatioDiffBigEnough = Math.abs(ratioDiff) > 0.1;
    if (isRatioDiffBigEnough || !ratioState) {
      setRatioState(newRatio);
    }
  }, [throttledWidth, ratioState]);
  const fallbackRatio = width ? width / normalizedWidth : 1;
  const ratio = ratioState ? ratioState : fallbackRatio;
  const isReady = !!width;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { style: { position: "relative" }, children: containerResizeListener }),
    isReady && /* @__PURE__ */ jsx(
      "div",
      {
        className: "global-styles-ui-preview__wrapper",
        style: {
          height: normalizedHeight * ratio
        },
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        tabIndex: -1,
        children: /* @__PURE__ */ jsx(
          motion.div,
          {
            style: {
              height: normalizedHeight * ratio,
              width: "100%",
              background: gradientValue ?? backgroundColor,
              cursor: withHoverView ? "pointer" : void 0
            },
            initial: "start",
            animate: (isHovered || isFocused) && !disableMotion && label ? "hover" : "start",
            children: [].concat(children).map(
              (child, key) => child({ ratio, key })
            )
          }
        )
      }
    )
  ] });
}
var preview_wrapper_default = PreviewWrapper;
export {
  preview_wrapper_default as default
};
//# sourceMappingURL=preview-wrapper.mjs.map
