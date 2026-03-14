// packages/block-library/src/post-comments-form/edit.js
import { useBlockProps } from "@wordpress/block-editor";
import { VisuallyHidden } from "@wordpress/components";
import { useInstanceId } from "@wordpress/compose";
import { __, sprintf } from "@wordpress/i18n";
import CommentsForm from "./form.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function PostCommentsFormEdit({ context }) {
  const { postId, postType } = context;
  const instanceId = useInstanceId(PostCommentsFormEdit);
  const instanceIdDesc = sprintf("comments-form-edit-%d-desc", instanceId);
  const blockProps = useBlockProps({
    "aria-describedby": instanceIdDesc
  });
  return /* @__PURE__ */ jsxs("div", { ...blockProps, children: [
    /* @__PURE__ */ jsx(CommentsForm, { postId, postType }),
    /* @__PURE__ */ jsx(VisuallyHidden, { id: instanceIdDesc, children: __("Comments form disabled in editor.") })
  ] });
}
export {
  PostCommentsFormEdit as default
};
//# sourceMappingURL=edit.mjs.map
