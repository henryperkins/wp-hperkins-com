// packages/fields/src/fields/parent/utils.ts
import { decodeEntities } from "@wordpress/html-entities";
import { __ } from "@wordpress/i18n";
function getTitleWithFallbackName(post) {
  return typeof post.title === "object" && "rendered" in post.title && post.title.rendered ? decodeEntities(post.title.rendered) : `#${post?.id} (${__("no title")})`;
}
export {
  getTitleWithFallbackName
};
//# sourceMappingURL=utils.mjs.map
