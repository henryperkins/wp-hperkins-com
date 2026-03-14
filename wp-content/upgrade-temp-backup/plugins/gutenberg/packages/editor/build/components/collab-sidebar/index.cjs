"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/collab-sidebar/index.js
var collab_sidebar_exports = {};
__export(collab_sidebar_exports, {
  default: () => NotesSidebarContainer
});
module.exports = __toCommonJS(collab_sidebar_exports);
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_components = require("@wordpress/components");
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_keyboard_shortcuts = require("@wordpress/keyboard-shortcuts");
var import_icons = require("@wordpress/icons");
var import_block_editor = require("@wordpress/block-editor");
var import_interface = require("@wordpress/interface");
var import_preferences = require("@wordpress/preferences");
var import_plugin_sidebar = __toESM(require("../plugin-sidebar/index.cjs"));
var import_constants = require("./constants.cjs");
var import_comments = require("./comments.cjs");
var import_store = require("../../store/index.cjs");
var import_comment_menu_item = __toESM(require("./comment-menu-item.cjs"));
var import_comment_indicator_toolbar = __toESM(require("./comment-indicator-toolbar.cjs"));
var import_global_styles_provider = require("../global-styles-provider/index.cjs");
var import_hooks = require("./hooks.cjs");
var import_post_type_support_check = __toESM(require("../post-type-support-check/index.cjs"));
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
function NotesSidebarContent({
  styles,
  comments,
  commentSidebarRef,
  reflowComments,
  commentLastUpdated,
  isFloating = false
}) {
  const { onCreate, onEdit, onDelete } = (0, import_hooks.useBlockCommentsActions)(reflowComments);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_components.__experimentalVStack,
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
      "aria-label": isFloating ? (0, import_i18n.__)("Unresolved notes") : (0, import_i18n.__)("All notes"),
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
        import_comments.Comments,
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
  const { getActiveComplementaryArea } = (0, import_data.useSelect)(import_interface.store);
  const { enableComplementaryArea } = (0, import_data.useDispatch)(import_interface.store);
  const { toggleBlockSpotlight, selectBlock } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_block_editor.store)
  );
  const { selectNote } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  const isLargeViewport = (0, import_compose.useViewportMatch)("medium");
  const commentSidebarRef = (0, import_element.useRef)(null);
  const { clientId, blockCommentId, isClassicBlock } = (0, import_data.useSelect)(
    (select) => {
      const {
        getBlockAttributes,
        getSelectedBlockClientId,
        getBlockName
      } = select(import_block_editor.store);
      const _clientId = getSelectedBlockClientId();
      return {
        clientId: _clientId,
        blockCommentId: _clientId ? getBlockAttributes(_clientId)?.metadata?.noteId : null,
        isClassicBlock: _clientId ? getBlockName(_clientId) === "core/freeform" : false
      };
    },
    []
  );
  const { isDistractionFree } = (0, import_data.useSelect)((select) => {
    const { get } = select(import_preferences.store);
    return {
      isDistractionFree: get("core", "distractionFree")
    };
  }, []);
  const selectedNote = (0, import_data.useSelect)(
    (select) => (0, import_lock_unlock.unlock)(select(import_store.store)).getSelectedNote(),
    []
  );
  const {
    resultComments,
    unresolvedSortedThreads,
    reflowComments,
    commentLastUpdated
  } = (0, import_hooks.useBlockComments)(postId);
  const showFloatingSidebar = isLargeViewport;
  const showAllNotesSidebar = resultComments.length > 0 || !showFloatingSidebar;
  (0, import_hooks.useEnableFloatingSidebar)(
    showFloatingSidebar && (unresolvedSortedThreads.length > 0 || selectedNote !== void 0)
  );
  (0, import_keyboard_shortcuts.useShortcut)(
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
  const { merged: GlobalStyles } = (0, import_global_styles_provider.useGlobalStylesContext)();
  const backgroundColor = GlobalStyles?.styles?.color?.background;
  const currentThread = blockCommentId ? resultComments.find((thread) => thread.id === blockCommentId) : null;
  async function openTheSidebar(selectedClientId) {
    const prevArea = await getActiveComplementaryArea("core");
    const activeNotesArea = import_constants.SIDEBARS.find((name) => name === prevArea);
    const targetClientId = selectedClientId && selectedClientId !== clientId ? selectedClientId : clientId;
    const targetNote = resultComments.find(
      (note) => note.blockClientId === targetClientId
    );
    if (targetNote?.status === "approved") {
      enableComplementaryArea("core", import_constants.ALL_NOTES_SIDEBAR);
    } else if (!activeNotesArea || !showAllNotesSidebar) {
      enableComplementaryArea(
        "core",
        showFloatingSidebar ? import_constants.FLOATING_NOTES_SIDEBAR : import_constants.ALL_NOTES_SIDEBAR
      );
    }
    const currentArea = await getActiveComplementaryArea("core");
    if (!import_constants.SIDEBARS.includes(currentArea)) {
      return;
    }
    selectBlock(targetClientId, null);
    toggleBlockSpotlight(targetClientId, true);
    selectNote(targetNote ? targetNote.id : "new", { focus: true });
  }
  if (isDistractionFree) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_comment_menu_item.default, { isDistractionFree: true });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    !!currentThread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_comment_indicator_toolbar.default,
      {
        thread: currentThread,
        onClick: openTheSidebar
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_comment_menu_item.default, { onClick: openTheSidebar }),
    showAllNotesSidebar && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_plugin_sidebar.default,
      {
        identifier: import_constants.ALL_NOTES_SIDEBAR,
        name: import_constants.ALL_NOTES_SIDEBAR,
        title: (0, import_i18n.__)("All notes"),
        header: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { className: "interface-complementary-area-header__title", children: (0, import_i18n.__)("All notes") }),
        icon: import_icons.comment,
        closeLabel: (0, import_i18n.__)("Close Notes"),
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          NotesSidebarContent,
          {
            comments: resultComments,
            commentSidebarRef
          }
        )
      }
    ),
    isLargeViewport && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_plugin_sidebar.default,
      {
        isPinnable: false,
        header: false,
        identifier: import_constants.FLOATING_NOTES_SIDEBAR,
        className: "editor-collab-sidebar",
        headerClassName: "editor-collab-sidebar__header",
        backgroundColor,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
  const { postId, editorMode, revisionsMode } = (0, import_data.useSelect)((select) => {
    const { getCurrentPostId, getEditorMode, isRevisionsMode } = (0, import_lock_unlock.unlock)(
      select(import_store.store)
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_post_type_support_check.default, { supportKeys: "editor.notes", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotesSidebar, { postId }) });
}
//# sourceMappingURL=index.cjs.map
