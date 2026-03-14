// packages/fields/src/components/media-edit/use-moving-animation.ts
import { Controller } from "@react-spring/web";
import { useLayoutEffect, useRef } from "@wordpress/element";
function getAbsolutePosition(element) {
  return {
    top: element.offsetTop,
    left: element.offsetLeft
  };
}
function useMovingAnimation(triggerAnimationOnChange) {
  const ref = useRef(null);
  const previousRef = useRef(void 0);
  if (ref.current) {
    previousRef.current = getAbsolutePosition(ref.current);
  }
  useLayoutEffect(() => {
    const previous = previousRef.current;
    if (!previous || !ref.current) {
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const controller = new Controller({
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
export {
  useMovingAnimation as default
};
//# sourceMappingURL=use-moving-animation.mjs.map
