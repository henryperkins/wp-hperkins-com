// packages/fields/src/actions/view-post.tsx
import { external } from "@wordpress/icons";
import { _x } from "@wordpress/i18n";
var viewPost = {
  id: "view-post",
  label: _x("View", "verb"),
  isPrimary: true,
  icon: external,
  isEligible(post) {
    return post.status !== "trash";
  },
  callback(posts, { onActionPerformed }) {
    const post = posts[0];
    window.open(post?.link, "_blank");
    if (onActionPerformed) {
      onActionPerformed(posts);
    }
  }
};
var view_post_default = viewPost;
export {
  view_post_default as default
};
//# sourceMappingURL=view-post.mjs.map
