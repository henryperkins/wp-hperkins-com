// packages/core-data/src/footnotes/get-rich-text-values-cached.js
import { privateApis as blockEditorPrivateApis } from "@wordpress/block-editor";
import { unlock } from "../lock-unlock.mjs";
var unlockedApis;
var cache = /* @__PURE__ */ new WeakMap();
function getRichTextValuesCached(block) {
  if (!unlockedApis) {
    unlockedApis = unlock(blockEditorPrivateApis);
  }
  if (!cache.has(block)) {
    const values = unlockedApis.getRichTextValues([block]);
    cache.set(block, values);
  }
  return cache.get(block);
}
export {
  getRichTextValuesCached as default
};
//# sourceMappingURL=get-rich-text-values-cached.mjs.map
