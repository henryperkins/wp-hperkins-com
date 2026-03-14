// packages/editor/src/utils/get-item-title.js
import { decodeEntities } from "@wordpress/html-entities";
function getItemTitle(item) {
  if (typeof item.title === "string") {
    return decodeEntities(item.title);
  }
  if (item.title && "rendered" in item.title) {
    return decodeEntities(item.title.rendered);
  }
  if (item.title && "raw" in item.title) {
    return decodeEntities(item.title.raw);
  }
  return "";
}
export {
  getItemTitle
};
//# sourceMappingURL=get-item-title.mjs.map
