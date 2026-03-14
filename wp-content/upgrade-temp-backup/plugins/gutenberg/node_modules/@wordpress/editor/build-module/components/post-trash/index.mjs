// packages/editor/src/components/post-trash/index.js
import { __, sprintf } from "@wordpress/i18n";
import {
  Button,
  __experimentalConfirmDialog as ConfirmDialog
} from "@wordpress/components";
import { useSelect, useDispatch, useRegistry } from "@wordpress/data";
import { useState } from "@wordpress/element";
import { store as editorStore } from "../../store/index.mjs";
import PostTrashCheck from "./check.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
function PostTrash({ onActionPerformed }) {
  const registry = useRegistry();
  const { isNew, isDeleting, postId, title } = useSelect((select) => {
    const store = select(editorStore);
    return {
      isNew: store.isEditedPostNew(),
      isDeleting: store.isDeletingPost(),
      postId: store.getCurrentPostId(),
      title: store.getCurrentPostAttribute("title")
    };
  }, []);
  const { trashPost } = useDispatch(editorStore);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  if (isNew || !postId) {
    return null;
  }
  const handleConfirm = async () => {
    setShowConfirmDialog(false);
    await trashPost();
    const item = await registry.resolveSelect(editorStore).getCurrentPost();
    onActionPerformed?.("move-to-trash", [item]);
  };
  return /* @__PURE__ */ jsxs(PostTrashCheck, { children: [
    /* @__PURE__ */ jsx(
      Button,
      {
        __next40pxDefaultSize: true,
        className: "editor-post-trash",
        isDestructive: true,
        variant: "secondary",
        isBusy: isDeleting,
        "aria-disabled": isDeleting,
        onClick: isDeleting ? void 0 : () => setShowConfirmDialog(true),
        children: __("Move to trash")
      }
    ),
    /* @__PURE__ */ jsx(
      ConfirmDialog,
      {
        isOpen: showConfirmDialog,
        onConfirm: handleConfirm,
        onCancel: () => setShowConfirmDialog(false),
        confirmButtonText: __("Move to trash"),
        size: "small",
        children: sprintf(
          // translators: %s: The item's title.
          __('Are you sure you want to move "%s" to the trash?'),
          title
        )
      }
    )
  ] });
}
export {
  PostTrash as default
};
//# sourceMappingURL=index.mjs.map
