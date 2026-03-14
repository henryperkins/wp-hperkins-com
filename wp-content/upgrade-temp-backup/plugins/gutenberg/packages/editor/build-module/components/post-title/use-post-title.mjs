// packages/editor/src/components/post-title/use-post-title.js
import { useSelect, useDispatch } from "@wordpress/data";
import { store as editorStore } from "../../store/index.mjs";
function usePostTitle() {
  const { editPost } = useDispatch(editorStore);
  const { title } = useSelect((select) => {
    const { getEditedPostAttribute } = select(editorStore);
    return {
      title: getEditedPostAttribute("title")
    };
  }, []);
  function updateTitle(newTitle) {
    editPost({ title: newTitle });
  }
  return { title, setTitle: updateTitle };
}
export {
  usePostTitle as default
};
//# sourceMappingURL=use-post-title.mjs.map
