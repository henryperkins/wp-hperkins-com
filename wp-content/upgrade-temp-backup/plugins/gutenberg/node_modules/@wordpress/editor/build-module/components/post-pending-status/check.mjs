// packages/editor/src/components/post-pending-status/check.js
import { useSelect } from "@wordpress/data";
import { store as editorStore } from "../../store/index.mjs";
function PostPendingStatusCheck({ children }) {
  const { hasPublishAction, isPublished } = useSelect((select) => {
    const { isCurrentPostPublished, getCurrentPost } = select(editorStore);
    return {
      hasPublishAction: getCurrentPost()._links?.["wp:action-publish"] ?? false,
      isPublished: isCurrentPostPublished()
    };
  }, []);
  if (isPublished || !hasPublishAction) {
    return null;
  }
  return children;
}
var check_default = PostPendingStatusCheck;
export {
  PostPendingStatusCheck,
  check_default as default
};
//# sourceMappingURL=check.mjs.map
