// packages/blocks/src/api/raw-handling/comment-remover.js
import { remove } from "@wordpress/dom";
function commentRemover(node) {
  if (node.nodeType === node.COMMENT_NODE) {
    remove(node);
  }
}
export {
  commentRemover as default
};
//# sourceMappingURL=comment-remover.mjs.map
