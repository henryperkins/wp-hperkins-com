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

// packages/fields/src/components/media-edit/use-moving-animation.ts
var use_moving_animation_exports = {};
__export(use_moving_animation_exports, {
  default: () => useMovingAnimation
});
module.exports = __toCommonJS(use_moving_animation_exports);
var import_web = require("@react-spring/web");
var import_element = require("@wordpress/element");
function getAbsolutePosition(element) {
  return {
    top: element.offsetTop,
    left: element.offsetLeft
  };
}
function useMovingAnimation(triggerAnimationOnChange) {
  const ref = (0, import_element.useRef)(null);
  const previousRef = (0, import_element.useRef)(void 0);
  if (ref.current) {
    previousRef.current = getAbsolutePosition(ref.current);
  }
  (0, import_element.useLayoutEffect)(() => {
    const previous = previousRef.current;
    if (!previous || !ref.current) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const controller = new import_web.Controller({
      x: 0,
      y: 0,
      config: { mass: 5, tension: 2e3, friction: 200 },
      onChange({ value }) {
        if (!ref.current) {
          return;
        }
        let { x: x2, y: y2 } = value;
        x2 = Math.round(x2);
        y2 = Math.round(y2);
        const finishedMoving = x2 === 0 && y2 === 0;
        ref.current.style.transform = finishedMoving ? "" : `translate3d(${x2}px,${y2}px,0)`;
      }
    });
    ref.current.style.transform = "";
    const destination = getAbsolutePosition(ref.current);
    const x = Math.round(previous.left - destination.left);
    const y = Math.round(previous.top - destination.top);
    controller.start({ x: 0, y: 0, from: { x, y } });
    return () => {
      controller.stop();
      controller.set({ x: 0, y: 0 });
    };
  }, [triggerAnimationOnChange]);
  return ref;
}
//# sourceMappingURL=use-moving-animation.cjs.map
