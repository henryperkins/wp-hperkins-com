// packages/edit-site/src/components/layout/animation.js
import { Controller, easings } from "@react-spring/web";
import { useLayoutEffect, useMemo, useRef } from "@wordpress/element";
function getAbsolutePosition(element) {
  return {
    top: element.offsetTop,
    left: element.offsetLeft
  };
}
var ANIMATION_DURATION = 400;
function useMovingAnimation({ triggerAnimationOnChange }) {
  const ref = useRef();
  const { previous, prevRect } = useMemo(
    () => ({
      previous: ref.current && getAbsolutePosition(ref.current),
      prevRect: ref.current && ref.current.getBoundingClientRect()
    }),
    [triggerAnimationOnChange]
  );
  useLayoutEffect(() => {
    if (!previous || !ref.current) {
      return;
    }
    const disableAnimation = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (disableAnimation) {
      return;
    }
    const controller = new Controller({
      x: 0,
      y: 0,
      width: prevRect.width,
      height: prevRect.height,
      config: {
        duration: ANIMATION_DURATION,
        easing: easings.easeInOutQuint
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
export {
  animation_default as default
};
//# sourceMappingURL=animation.mjs.map
