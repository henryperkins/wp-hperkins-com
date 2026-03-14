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

// packages/edit-site/src/components/layout/animation.js
var animation_exports = {};
__export(animation_exports, {
  default: () => animation_default
});
module.exports = __toCommonJS(animation_exports);
var import_web = require("@react-spring/web");
var import_element = require("@wordpress/element");
function getAbsolutePosition(element) {
  return {
    top: element.offsetTop,
    left: element.offsetLeft
  };
}
var ANIMATION_DURATION = 400;
function useMovingAnimation({ triggerAnimationOnChange }) {
  const ref = (0, import_element.useRef)();
  const { previous, prevRect } = (0, import_element.useMemo)(
    () => ({
      previous: ref.current && getAbsolutePosition(ref.current),
      prevRect: ref.current && ref.current.getBoundingClientRect()
    }),
    [triggerAnimationOnChange]
  );
  (0, import_element.useLayoutEffect)(() => {
    if (!previous || !ref.current) {
      return;
    }
    const disableAnimation = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (disableAnimation) {
      return;
    }
    const controller = new import_web.Controller({
      x: 0,
      y: 0,
      width: prevRect.width,
      height: prevRect.height,
      config: {
        duration: ANIMATION_DURATION,
        easing: import_web.easings.easeInOutQuint
      },
      onChange({ value }) {
        if (!ref.current) {
          return;
        }
        let { x: x2, y: y2, width: width2, height: height2 } = value;
        x2 = Math.round(x2);
        y2 = Math.round(y2);
        width2 = Math.round(width2);
        height2 = Math.round(height2);
        const finishedMoving = x2 === 0 && y2 === 0;
        ref.current.style.transformOrigin = "center center";
        ref.current.style.transform = finishedMoving ? null : `translate3d(${x2}px,${y2}px,0)`;
        ref.current.style.width = finishedMoving ? null : `${width2}px`;
        ref.current.style.height = finishedMoving ? null : `${height2}px`;
      }
    });
    ref.current.style.transform = void 0;
    const destination = ref.current.getBoundingClientRect();
    const x = Math.round(prevRect.left - destination.left);
    const y = Math.round(prevRect.top - destination.top);
    const width = destination.width;
    const height = destination.height;
    controller.start({
      x: 0,
      y: 0,
      width,
      height,
      from: { x, y, width: prevRect.width, height: prevRect.height }
    });
    return () => {
      controller.stop();
      controller.set({
        x: 0,
        y: 0,
        width: prevRect.width,
        height: prevRect.height
      });
    };
  }, [previous, prevRect]);
  return ref;
}
var animation_default = useMovingAnimation;
//# sourceMappingURL=animation.cjs.map
