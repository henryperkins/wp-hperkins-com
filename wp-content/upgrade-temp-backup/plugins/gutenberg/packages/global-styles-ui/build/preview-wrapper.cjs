"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/global-styles-ui/src/preview-wrapper.tsx
var preview_wrapper_exports = {};
__export(preview_wrapper_exports, {
  default: () => preview_wrapper_default
});
module.exports = __toCommonJS(preview_wrapper_exports);
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_element = require("@wordpress/element");
var import_hooks = require("./hooks.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
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
  const [backgroundColor = "white"] = (0, import_hooks.useStyle)("color.background");
  const [gradientValue] = (0, import_hooks.useStyle)("color.gradient");
  const disableMotion = (0, import_compose.useReducedMotion)();
  const [isHovered, setIsHovered] = (0, import_element.useState)(false);
  const [containerResizeListener, { width }] = (0, import_compose.useResizeObserver)();
  const [throttledWidth, setThrottledWidthState] = (0, import_element.useState)(width);
  const [ratioState, setRatioState] = (0, import_element.useState)();
  const setThrottledWidth = (0, import_compose.useThrottle)(
    setThrottledWidthState,
    250,
    THROTTLE_OPTIONS
  );
  (0, import_element.useLayoutEffect)(() => {
    if (width) {
      setThrottledWidth(width);
    }
  }, [width, setThrottledWidth]);
  (0, import_element.useLayoutEffect)(() => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { style: { position: "relative" }, children: containerResizeListener }),
    isReady && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "div",
      {
        className: "global-styles-ui-preview__wrapper",
        style: {
          height: normalizedHeight * ratio
        },
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        tabIndex: -1,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__unstableMotion.div,
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
//# sourceMappingURL=preview-wrapper.cjs.map
