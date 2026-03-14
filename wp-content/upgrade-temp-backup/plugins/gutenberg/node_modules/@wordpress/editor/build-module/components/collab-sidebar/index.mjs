// packages/editor/src/components/collab-sidebar/index.js
import { __ } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import { __experimentalVStack as VStack } from "@wordpress/components";
import { useRef } from "@wordpress/element";
import { useViewportMatch } from "@wordpress/compose";
import { useShortcut } from "@wordpress/keyboard-shortcuts";
import { comment as commentIcon } from "@wordpress/icons";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { store as interfaceStore } from "@wordpress/interface";
import { store as preferencesStore } from "@wordpress/preferences";
import PluginSidebar from "../plugin-sidebar/index.mjs";
import {
  ALL_NOTES_SIDEBAR,
  FLOATING_NOTES_SIDEBAR,
  SIDEBARS
} from "./constants.mjs";
import { Comments } from "./comments.mjs";
import { store as editorStore } from "../../store/index.mjs";
import AddCommentMenuItem from "./comment-menu-item.mjs";
import CommentAvatarIndicator from "./comment-indicator-toolbar.mjs";
import { useGlobalStylesContext } from "../global-styles-provider/index.mjs";
import {
  useBlockComments,
  useBlockCommentsActions,
  useEnableFloatingSidebar
} from "./hooks.mjs";
import PostTypeSupportCheck from "../post-type-support-check/index.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function NotesSidebarContent({
  styles,
  comments,
  commentSidebarRef,
  reflowComments,
  commentLastUpdated,
  isFloating = false
}) {
  const { onCreate, onEdit, onDelete } = useBlockCommentsActions(reflowComments);
  return /* @__PURE__ */ jsx(
    VStack,
    {
      className: "editor-collab-sidebar-panel",
      style: styles,
      role: "tree",
      spacing: "3",
      justify: "flex-start",
      ref: (node) => {
        if (node) {
          commentSidebarRef.current = node;
        }
      },
      "aria-label": isFloating ? __("Unresolved notes") : __("All notes"),
      children: /* @__PURE__ */ jsx(
        Comments,
        {
          threads: comments,
          onEditComment: onEdit,
          onAddReply: onCreate,
          onCommentDelete: onDelete,
          commentSidebarRef,
          reflowComments,
          commentLastUpdated,
          isFloating
        }
      )
    }
  );
}
function NotesSidebar({ postId }) {
  const { getActiveComplementaryArea } = useSelect(interfaceStore);
  const { enableComplementaryArea } = useDispatch(interfaceStore);
  const { toggleBlockSpotlight, selectBlock } = unlock(
    useDispatch(blockEditorStore)
  );
  const { selectNote } = unlock(useDispatch(editorStore));
  const isLargeViewport = useViewportMatch("medium");
  const commentSidebarRef = useRef(null);
  const { clientId, blockCommentId, isClassicBlock } = useSelect(
    (select) => {
      const {
        getBlockAttributes,
        getSelectedBlockClientId,
        getBlockName
      } = select(blockEditorStore);
      const _clientId = getSelectedBlockClientId();
      return {
        clientId: _clientId,
        blockCommentId: _clientId ? getBlockAttributes(_clientId)?.metadata?.noteId : null,
        isClassicBlock: _clientId ? getBlockName(_clientId) === "core/freeform" : false
      };
    },
    []
  );
  const { isDistractionFree } = useSelect((select) => {
    const { get } = select(preferencesStore);
    return {
      isDistractionFree: get("core", "distractionFree")
    };
  }, []);
  const selectedNote = useSelect(
    (select) => unlock(select(editorStore)).getSelectedNote(),
    []
  );
  const {
    resultComments,
    unresolvedSortedThreads,
    reflowComments,
    commentLastUpdated
  } = useBlockComments(postId);
  const showFloatingSidebar = isLargeViewport;
  const showAllNotesSidebar = resultComments.length > 0 || !showFloatingSidebar;
  useEnableFloatingSidebar(
    showFloatingSidebar && (unresolvedSortedThreads.length > 0 || selectedNote !== void 0)
  );
  useShortcut(
    "core/editor/new-note",
    (event) => {
      event.preventDefault();
      openTheSidebar();
    },
    {
      // When multiple notes per block are supported. Remove note ID check.
      // See: https://github.com/WordPress/gutenberg/pull/75147.
      isDisabled: isDistractionFree || isClassicBlock || !clientId || !!blockCommentId
    }
  );
  const { merged: GlobalStyles } = useGlobalStylesContext();
  const backgroundColor = GlobalStyles?.styles?.color?.background;
  const currentThread = blockCommentId ? resultComments.find((thread) => thread.id === blockCommentId) : null;
  async function openTheSidebar(selectedClientId) {
    const prevArea = await getActiveComplementaryArea("core");
    const activeNotesArea = SIDEBARS.find((name) => name === prevArea);
    const targetClientId = selectedClientId && selectedClientId !== clientId ? selectedClientId : clientId;
    const targetNote = resultComments.find(
      (note) => note.blockClientId === targetClientId
    );
    if (targetNote?.status === "approved") {
      enableComplementaryArea("core", ALL_NOTES_SIDEBAR);
    } else if (!activeNotesArea || !showAllNotesSidebar) {
      enableComplementaryArea(
        "core",
        showFloatingSidebar ? FLOATING_NOTES_SIDEBAR : ALL_NOTES_SIDEBAR
      );
    }
    const currentArea = await getActiveComplementaryArea("core");
    if (!SIDEBARS.includes(currentArea)) {
      return;
    }
    selectBlock(targetClientId, null);
    toggleBlockSpotlight(targetClientId, true);
    selectNote(targetNote ? targetNote.id : "new", { focus: true });
  }
  if (isDistractionFree) {
    return /* @__PURE__ */ jsx(AddCommentMenuItem, { isDistractionFree: true });
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !!currentThread && /* @__PURE__ */ jsx(
      CommentAvatarIndicator,
      {
        thread: currentThread,
        onClick: openTheSidebar
      }
    ),
    /* @__PURE__ */ jsx(AddCommentMenuItem, { onClick: openTheSidebar }),
    showAllNotesSidebar && /* @__PURE__ */ jsx(
      PluginSidebar,
      {
        identifier: ALL_NOTES_SIDEBAR,
        name: ALL_NOTES_SIDEBAR,
        title: __("All notes"),
        header: /* @__PURE__ */ jsx("h2", { className: "interface-complementary-area-header__title", children: __("All notes") }),
        icon: commentIcon,
        closeLabel: __("Close Notes"),
        children: /* @__PURE__ */ jsx(
          NotesSidebarContent,
          {
            comments: resultComments,
            commentSidebarRef
          }
        )
      }
    ),
    isLargeViewport && /* @__PURE__ */ jsx(
      PluginSidebar,
      {
        isPinnable: false,
        header: false,
        identifier: FLOATING_NOTES_SIDEBAR,
        className: "editor-collab-sidebar",
        headerClassName: "editor-collab-sidebar__header",
        backgroundColor,
        children: /* @__PURE__ */ jsx(
          NotesSidebarContent,
          {
            comments: unresolvedSortedThreads,
            commentSidebarRef,
            reflowComments,
            commentLastUpdated,
            styles: {
              backgroundColor
            },
            isFloating: true
          }
        )
      }
    )
  ] });
}
function NotesSidebarContainer() {
  const { postId, editorMode, revisionsMode } = useSelect((select) => {
    const { getCurrentPostId, getEditorMode, isRevisionsMode } = unlock(
      select(editorStore)
    );
    return {
      postId: getCurrentPostId(),
      editorMode: getEditorMode(),
      revisionsMode: isRevisionsMode()
    };
  }, []);
  if (!postId || typeof postId !== "number") {
    return null;
  }
  if (editorMode === "text" || revisionsMode) {
    return null;
  }
  return /* @__PURE__ */ jsx(PostTypeSupportCheck, { supportKeys: "editor.notes", children: /* @__PURE__ */ jsx(NotesSidebar, { postId }) });
}
export {
  NotesSidebarContainer as default
};
//# sourceMappingURL=index.mjs.map
