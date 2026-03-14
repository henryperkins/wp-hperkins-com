// packages/editor/src/components/post-trash/check.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
import { GLOBAL_POST_TYPES } from "../../store/constants.mjs";
function PostTrashCheck({ children }) {
  const { canTrashPost } = useSelect((select) => {
    const { isEditedPostNew, getCurrentPostId, getCurrentPostType } = select(editorStore);
    const { canUser } = select(coreStore);
    const postType = getCurrentPostType();
    const postId = getCurrentPostId();
    const isNew = isEditedPostNew();
    const canUserDelete = !!postId ? canUser("delete", {
      kind: "postType",
      name: postType,
      id: postId
    }) : false;
    return {
      canTrashPost: (!isNew || postId) && canUserDelete && !GLOBAL_POST_TYPES.includes(postType)
    };
  }, []);
  if (!canTrashPost) {
    return null;
  }
  return children;
}
export {
  PostTrashCheck as default
};
//# sourceMappingURL=check.mjs.map
