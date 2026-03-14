// packages/editor/src/utils/pageTypeBadge.js
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
function usePageTypeBadge(postId) {
  const { isFrontPage, isPostsPage } = useSelect((select) => {
    const { canUser, getEditedEntityRecord } = select(coreStore);
    const siteSettings = canUser("read", {
      kind: "root",
      name: "site"
    }) ? getEditedEntityRecord("root", "site") : void 0;
    const _postId = parseInt(postId, 10);
    return {
      isFrontPage: siteSettings?.page_on_front === _postId,
      isPostsPage: siteSettings?.page_for_posts === _postId
    };
  });
  if (isFrontPage) {
    return __("Homepage");
  } else if (isPostsPage) {
    return __("Posts Page");
  }
  return false;
}
export {
  usePageTypeBadge as default
};
//# sourceMappingURL=pageTypeBadge.mjs.map
