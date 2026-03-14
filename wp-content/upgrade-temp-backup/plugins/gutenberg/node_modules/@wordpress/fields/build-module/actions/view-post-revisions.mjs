// packages/fields/src/actions/view-post-revisions.tsx
import { addQueryArgs } from "@wordpress/url";
import { __, sprintf } from "@wordpress/i18n";
var viewPostRevisions = {
  id: "view-post-revisions",
  context: "list",
  label(items) {
    const revisionsCount = items[0]._links?.["version-history"]?.[0]?.count ?? 0;
    return sprintf(
      /* translators: %d: number of revisions. */
      __("View revisions (%d)"),
      revisionsCount
    );
  },
  isEligible(post) {
    if (post.status === "trash") {
      return false;
    }
    const lastRevisionId = post?._links?.["predecessor-version"]?.[0]?.id ?? null;
    const revisionsCount = post?._links?.["version-history"]?.[0]?.count ?? 0;
    return !!lastRevisionId && revisionsCount > 1;
  },
  callback(posts, { onActionPerformed }) {
    const post = posts[0];
    const href = addQueryArgs("revision.php", {
      revision: post?._links?.["predecessor-version"]?.[0]?.id
    });
    document.location.href = href;
    if (onActionPerformed) {
      onActionPerformed(posts);
    }
  }
};
var view_post_revisions_default = viewPostRevisions;
export {
  view_post_revisions_default as default
};
//# sourceMappingURL=view-post-revisions.mjs.map
