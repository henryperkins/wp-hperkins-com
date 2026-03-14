// packages/global-styles-engine/src/core/equal.ts
import fastDeepEqual from "fast-deep-equal/es6/index.js";
function areGlobalStylesEqual(original, variation) {
  if (typeof original !== "object" || typeof variation !== "object") {
    return original === variation;
  }
  return fastDeepEqual(original?.styles, variation?.styles) && fastDeepEqual(original?.settings, variation?.settings);
}
export {
  areGlobalStylesEqual
};
//# sourceMappingURL=equal.mjs.map
