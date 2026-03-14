// packages/editor/src/components/post-author/check.js
import { useSelect } from "@wordpress/data";
import PostTypeSupportCheck from "../post-type-support-check/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function PostAuthorCheck({ children }) {
  const { hasAssignAuthorAction } = useSelect((select) => {
    const post = select(editorStore).getCurrentPost();
    const canAssignAuthor = post?._links?.["wp:action-assign-author"] ? true : false;
    return {
      hasAssignAuthorAction: canAssignAuthor
    };
  }, []);
  if (!hasAssignAuthorAction) {
    return null;
  }
  return /* @__PURE__ */ jsx(PostTypeSupportCheck, { supportKeys: "author", children });
}
export {
  PostAuthorCheck as default
};
//# sourceMappingURL=check.mjs.map
