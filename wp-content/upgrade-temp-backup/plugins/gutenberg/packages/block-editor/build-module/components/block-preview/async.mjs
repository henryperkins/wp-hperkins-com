// packages/block-editor/src/components/block-preview/async.js
import { useEffect, useState, flushSync } from "@wordpress/element";
import { createQueue } from "@wordpress/priority-queue";
var blockPreviewQueue = createQueue();
function Async({ children, placeholder }) {
  const [shouldRender, setShouldRender] = useState(false);
  useEffect(() => {
    const context = {};
    blockPreviewQueue.add(context, () => {
      flushSync(() => {
        setShouldRender(true);
      });
    });
    return () => {
      blockPreviewQueue.cancel(context);
    };
  }, []);
  if (!shouldRender) {
    return placeholder;
  }
  return children;
}
export {
  Async
};
//# sourceMappingURL=async.mjs.map
