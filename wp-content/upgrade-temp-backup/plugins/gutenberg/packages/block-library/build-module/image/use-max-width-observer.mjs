// packages/block-library/src/image/use-max-width-observer.js
import { useRef } from "@wordpress/element";
import { useResizeObserver } from "@wordpress/compose";
import { jsx } from "react/jsx-runtime";
function useMaxWidthObserver() {
  const [contentResizeListener, { width }] = useResizeObserver();
  const observerRef = useRef();
  const maxWidthObserver = /* @__PURE__ */ jsx(
    "div",
    {
      className: "wp-block",
      "aria-hidden": "true",
      style: {
        position: "absolute",
        inset: 0,
        width: "100%",
        height: 0,
        margin: 0
      },
      ref: observerRef,
      children: contentResizeListener
    }
  );
  return [maxWidthObserver, width];
}
export {
  useMaxWidthObserver
};
//# sourceMappingURL=use-max-width-observer.mjs.map
