// packages/editor/src/components/post-last-revision/check.js
import { useSelect } from "@wordpress/data";
import PostTypeSupportCheck from "../post-type-support-check/index.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function PostLastRevisionCheck({ children }) {
  const { lastRevisionId, revisionsCount } = useSelect((select) => {
    const { getCurrentPostLastRevisionId, getCurrentPostRevisionsCount } = select(editorStore);
    return {
      lastRevisionId: getCurrentPostLastRevisionId(),
      revisionsCount: getCurrentPostRevisionsCount()
    };
  }, []);
  if (!lastRevisionId || revisionsCount < 2) {
    return null;
  }
  return /* @__PURE__ */ jsx(PostTypeSupportCheck, { supportKeys: "revisions", children });
}
var check_default = PostLastRevisionCheck;
export {
  check_default as default
};
//# sourceMappingURL=check.mjs.map
