// packages/editor/src/components/collab-sidebar/add-comment.js
import clsx from "clsx";
import { __ } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import {
  __experimentalHStack as HStack,
  __experimentalVStack as VStack
} from "@wordpress/components";
import {
  store as blockEditorStore,
  privateApis as blockEditorPrivateApis
} from "@wordpress/block-editor";
import { unlock } from "../../lock-unlock.mjs";
import CommentAuthorInfo from "./comment-author-info.mjs";
import CommentForm from "./comment-form.mjs";
import { focusCommentThread, noop } from "./utils.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx, jsxs } from "react/jsx-runtime";
var { useBlockElement } = unlock(blockEditorPrivateApis);
function AddComment({
  onSubmit,
  commentSidebarRef,
  reflowComments = noop,
  isFloating = false,
  y,
  refs
}) {
  const { clientId } = useSelect((select) => {
    const { getSelectedBlockClientId } = select(blockEditorStore);
    return {
      clientId: getSelectedBlockClientId()
    };
  }, []);
  const selectedNote = useSelect(
    (select) => unlock(select(editorStore)).getSelectedNote(),
    []
  );
  const blockElement = useBlockElement(clientId);
  const { toggleBlockSpotlight } = unlock(useDispatch(blockEditorStore));
  const { selectNote } = unlock(useDispatch(editorStore));
  const unselectThread = () => {
    selectNote(void 0);
    blockElement?.focus();
    toggleBlockSpotlight(clientId, false);
  };
  if (selectedNote !== "new" || !clientId) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    VStack,
    {
      className: clsx(
        "editor-collab-sidebar-panel__thread is-selected",
        {
          "is-floating": isFloating
        }
      ),
      spacing: "3",
      tabIndex: 0,
      "aria-label": __("New note"),
      role: "treeitem",
      ref: isFloating ? refs.setFloating : void 0,
      style: isFloating ? (
        // Delay showing the floating note box until a Y position is known to prevent blink.
        { top: y, opacity: !y ? 0 : void 0 }
      ) : void 0,
      onBlur: (event) => {
        if (!document.hasFocus()) {
          return;
        }
        if (event.currentTarget.contains(event.relatedTarget)) {
          return;
        }
        toggleBlockSpotlight(clientId, false);
        selectNote(void 0);
      },
      children: [
        /* @__PURE__ */ jsx(HStack, { alignment: "left", spacing: "3", children: /* @__PURE__ */ jsx(CommentAuthorInfo, {}) }),
        /* @__PURE__ */ jsx(
          CommentForm,
          {
            onSubmit: async (inputComment) => {
              const { id } = await onSubmit({ content: inputComment });
              selectNote(id);
              focusCommentThread(id, commentSidebarRef.current);
            },
            onCancel: unselectThread,
            reflowComments,
            submitButtonText: __("Add note"),
            labelText: __("New note")
          }
        )
      ]
    }
  );
}
export {
  AddComment
};
//# sourceMappingURL=add-comment.mjs.map
