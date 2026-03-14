// packages/core-data/src/utils/conservative-map-item.js
import fastDeepEqual from "fast-deep-equal/es6/index.js";
function conservativeMapItem(item, nextItem) {
  if (!item) {
    return nextItem;
  }
  let hasChanges = false;
  const result = {};
  for (const key in nextItem) {
    if (fastDeepEqual(item[key], nextItem[key])) {
      result[key] = item[key];
    } else {
      hasChanges = true;
      result[key] = nextItem[key];
    }
  }
  if (!hasChanges) {
    return item;
  }
  for (const key in item) {
    if (!result.hasOwnProperty(key)) {
      result[key] = item[key];
    }
  }
  return result;
}
export {
  conservativeMapItem as default
};
//# sourceMappingURL=conservative-map-item.mjs.map
