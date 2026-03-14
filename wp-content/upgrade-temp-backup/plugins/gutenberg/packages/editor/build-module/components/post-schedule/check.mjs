// packages/editor/src/components/post-schedule/check.js
import { useSelect } from "@wordpress/data";
import { store as editorStore } from "../../store/index.mjs";
function PostScheduleCheck({ children }) {
  const hasPublishAction = useSelect((select) => {
    return select(editorStore).getCurrentPost()._links?.["wp:action-publish"] ?? false;
  }, []);
  if (!hasPublishAction) {
    return null;
  }
  return children;
}
export {
  PostScheduleCheck as default
};
//# sourceMappingURL=check.mjs.map
