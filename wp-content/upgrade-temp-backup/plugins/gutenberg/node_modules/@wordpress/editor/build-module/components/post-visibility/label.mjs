// packages/editor/src/components/post-visibility/label.js
import { useSelect } from "@wordpress/data";
import { VISIBILITY_OPTIONS } from "./utils.mjs";
import { store as editorStore } from "../../store/index.mjs";
function PostVisibilityLabel() {
  return usePostVisibilityLabel();
}
function usePostVisibilityLabel() {
  const visibility = useSelect(
    (select) => select(editorStore).getEditedPostVisibility(),
    []
  );
  return VISIBILITY_OPTIONS.find((option) => option.value === visibility)?.label;
}
export {
  PostVisibilityLabel as default,
  usePostVisibilityLabel
};
//# sourceMappingURL=label.mjs.map
