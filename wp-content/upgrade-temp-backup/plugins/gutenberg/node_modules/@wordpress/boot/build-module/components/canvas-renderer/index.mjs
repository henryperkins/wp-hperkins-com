// packages/boot/src/components/canvas-renderer/index.tsx
import { useState, useEffect } from "@wordpress/element";
import Canvas from "../canvas/index.mjs";
import { jsx } from "react/jsx-runtime";
function CanvasRenderer({
  canvas,
  routeContentModule
}) {
  const [CustomCanvas, setCustomCanvas] = useState(null);
  useEffect(() => {
    if (canvas === null && routeContentModule) {
      import(routeContentModule).then((module) => {
        setCustomCanvas(() => module.canvas);
      }).catch((error) => {
        console.error("Failed to load custom canvas:", error);
      });
    } else {
      setCustomCanvas(null);
    }
  }, [canvas, routeContentModule]);
  if (canvas === void 0) {
    return null;
  }
  if (canvas === null) {
    if (!CustomCanvas) {
      return null;
    }
    return /* @__PURE__ */ jsx(CustomCanvas, {});
  }
  return /* @__PURE__ */ jsx(Canvas, { canvas });
}
export {
  CanvasRenderer as default
};
//# sourceMappingURL=index.mjs.map
