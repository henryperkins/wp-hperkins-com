// packages/block-library/src/tab/slug-from-label.js
import { cleanForSlug } from "@wordpress/url";
function slugFromLabel(label, tabIndex) {
  const htmlDocument = new window.DOMParser().parseFromString(
    label,
    "text/html"
  );
  if (htmlDocument.body?.textContent) {
    return cleanForSlug(htmlDocument.body.textContent);
  }
  return `tab-panel-${tabIndex}`;
}
export {
  slugFromLabel as default
};
//# sourceMappingURL=slug-from-label.mjs.map
