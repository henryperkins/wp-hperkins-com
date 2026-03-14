// packages/editor/src/components/post-url/label.js
import { useSelect } from "@wordpress/data";
import { filterURLForDisplay, safeDecodeURIComponent } from "@wordpress/url";
import { store as editorStore } from "../../store/index.mjs";
function PostURLLabel() {
  return usePostURLLabel();
}
function usePostURLLabel() {
  const postLink = useSelect(
    (select) => select(editorStore).getPermalink(),
    []
  );
  return filterURLForDisplay(safeDecodeURIComponent(postLink));
}
export {
  PostURLLabel as default,
  usePostURLLabel
};
//# sourceMappingURL=label.mjs.map
