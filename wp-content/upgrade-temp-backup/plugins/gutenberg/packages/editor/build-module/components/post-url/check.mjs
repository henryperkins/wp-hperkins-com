// packages/editor/src/components/post-url/check.js
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { store as editorStore } from "../../store/index.mjs";
function PostURLCheck({ children }) {
  const isVisible = useSelect((select) => {
    const postTypeSlug = select(editorStore).getCurrentPostType();
    const postType = select(coreStore).getPostType(postTypeSlug);
    if (!postType?.viewable) {
      return false;
    }
    const post = select(editorStore).getCurrentPost();
    if (!post.link) {
      return false;
    }
    const permalinkParts = select(editorStore).getPermalinkParts();
    if (!permalinkParts) {
      return false;
    }
    return true;
  }, []);
  if (!isVisible) {
    return null;
  }
  return children;
}
export {
  PostURLCheck as default
};
//# sourceMappingURL=check.mjs.map
