// packages/editor/src/components/post-comments/index.js
import { __, _x } from "@wordpress/i18n";
import {
  RadioControl,
  __experimentalVStack as VStack
} from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var COMMENT_OPTIONS = [
  {
    label: _x("Open", 'Adjective: e.g. "Comments are open"'),
    value: "open",
    description: __("Visitors can add new comments and replies.")
  },
  {
    label: __("Closed"),
    value: "closed",
    description: [
      __("Visitors cannot add new comments or replies."),
      __("Existing comments remain visible.")
    ].join(" ")
  }
];
function PostComments() {
  const commentStatus = useSelect(
    (select) => select(editorStore).getEditedPostAttribute("comment_status") ?? "open",
    []
  );
  const { editPost } = useDispatch(editorStore);
  const handleStatus = (newCommentStatus) => editPost({
    comment_status: newCommentStatus
  });
  return /* @__PURE__ */ jsx("form", { children: /* @__PURE__ */ jsx(VStack, { spacing: 4, children: /* @__PURE__ */ jsx(
    RadioControl,
    {
      className: "editor-change-status__options",
      hideLabelFromVision: true,
      label: __("Comment status"),
      options: COMMENT_OPTIONS,
      onChange: handleStatus,
      selected: commentStatus
    }
  ) }) });
}
var post_comments_default = PostComments;
export {
  post_comments_default as default
};
//# sourceMappingURL=index.mjs.map
