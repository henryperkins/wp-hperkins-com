// packages/editor/src/components/post-sticky/check.js
import { useSelect } from "@wordpress/data";
import { store as editorStore } from "../../store/index.mjs";
function PostStickyCheck({ children }) {
  const { hasStickyAction, postType } = useSelect((select) => {
    const post = select(editorStore).getCurrentPost();
    return {
      hasStickyAction: post._links?.["wp:action-sticky"] ?? false,
      postType: select(editorStore).getCurrentPostType()
    };
  }, []);
  if (postType !== "post" || !hasStickyAction) {
    return null;
  }
  return children;
}
export {
  PostStickyCheck as default
};
//# sourceMappingURL=check.mjs.map
