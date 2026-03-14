// packages/editor/src/components/post-pending-status/index.js
import { __ } from "@wordpress/i18n";
import { CheckboxControl } from "@wordpress/components";
import { useDispatch, useSelect } from "@wordpress/data";
import PostPendingStatusCheck from "./check.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
function PostPendingStatus() {
  const status = useSelect(
    (select) => select(editorStore).getEditedPostAttribute("status"),
    []
  );
  const { editPost } = useDispatch(editorStore);
  const togglePendingStatus = () => {
    const updatedStatus = status === "pending" ? "draft" : "pending";
    editPost({ status: updatedStatus });
  };
  return /* @__PURE__ */ jsx(PostPendingStatusCheck, { children: /* @__PURE__ */ jsx(
    CheckboxControl,
    {
      label: __("Pending review"),
      checked: status === "pending",
      onChange: togglePendingStatus
    }
  ) });
}
var post_pending_status_default = PostPendingStatus;
export {
  PostPendingStatus,
  post_pending_status_default as default
};
//# sourceMappingURL=index.mjs.map
