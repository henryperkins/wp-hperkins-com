// packages/editor/src/components/post-visibility/check.js
import { useSelect } from "@wordpress/data";
import { store as editorStore } from "../../store/index.mjs";
function PostVisibilityCheck({ render }) {
  const canEdit = useSelect((select) => {
    return select(editorStore).getCurrentPost()._links?.["wp:action-publish"] ?? false;
  });
  return render({ canEdit });
}
export {
  PostVisibilityCheck as default
};
//# sourceMappingURL=check.mjs.map
