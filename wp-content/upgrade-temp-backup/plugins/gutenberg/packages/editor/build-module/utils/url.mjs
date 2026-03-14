// packages/editor/src/utils/url.js
import { cleanForSlug as urlCleanForSlug } from "@wordpress/url";
import deprecated from "@wordpress/deprecated";
function cleanForSlug(string) {
  deprecated("wp.editor.cleanForSlug", {
    since: "12.7",
    plugin: "Gutenberg",
    alternative: "wp.url.cleanForSlug"
  });
  return urlCleanForSlug(string);
}
export {
  cleanForSlug
};
//# sourceMappingURL=url.mjs.map
