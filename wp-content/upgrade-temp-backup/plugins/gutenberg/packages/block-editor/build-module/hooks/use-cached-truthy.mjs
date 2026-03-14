// packages/block-editor/src/hooks/use-cached-truthy.js
import { useState, useEffect } from "@wordpress/element";
function useCachedTruthy(value) {
  const [cachedValue, setCachedValue] = useState(value);
  useEffect(() => {
    if (value) {
      setCachedValue(value);
    }
  }, [value]);
  return cachedValue;
}
export {
  useCachedTruthy
};
//# sourceMappingURL=use-cached-truthy.mjs.map
