// packages/editor/src/components/post-sticky/index.js
import { __ } from "@wordpress/i18n";
import { CheckboxControl } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import PostStickyCheck from "./check.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function PostSticky() {
  const postSticky = useSelect((select) => {
    return select(editorStore).getEditedPostAttribute("sticky") ?? false;
  }, []);
  const { editPost } = useDispatch(editorStore);
  return /* @__PURE__ */ jsx(PostStickyCheck, { children: /* @__PURE__ */ jsx(
    CheckboxControl,
    {
      className: "editor-post-sticky__checkbox-control",
      label: __("Sticky"),
      help: __("Pin this post to the top of the blog."),
      checked: postSticky,
      onChange: () => editPost({ sticky: !postSticky })
    }
  ) });
}
export {
  PostSticky as default
};
//# sourceMappingURL=index.mjs.map
