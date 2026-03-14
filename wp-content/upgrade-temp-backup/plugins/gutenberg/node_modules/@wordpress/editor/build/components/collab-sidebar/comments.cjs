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

// packages/editor/src/components/collab-sidebar/comments.js
var comments_exports = {};
__export(comments_exports, {
  Comments: () => Comments,
  default: () => comments_default
});
module.exports = __toCommonJS(comments_exports);
var import_clsx = __toESM(require("clsx"));
var import_element = require("@wordpress/element");
var import_components = require("@wordpress/components");
var import_compose = require("@wordpress/compose");
var import_icons = require("@wordpress/icons");
var import_i18n = require("@wordpress/i18n");
var import_data = require("@wordpress/data");
var import_dom = require("@wordpress/dom");
var import_block_editor = require("@wordpress/block-editor");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_comment_author_info = __toESM(require("./comment-author-info.cjs"));
var import_comment_form = __toESM(require("./comment-form.cjs"));
var import_utils = require("./utils.cjs");
var import_hooks = require("./hooks.cjs");
var import_add_comment = require("./add-comment.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
var { useBlockElement } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
var { Menu } = (0, import_lock_unlock.unlock)(import_components.privateApis);
function Comments({
  threads: noteThreads,
  onEditComment,
  onAddReply,
  onCommentDelete,
  commentSidebarRef,
  reflowComments,
  isFloating = false,
  commentLastUpdated
}) {
  const [heights, setHeights] = (0, import_element.useState)({});
  const [boardOffsets, setBoardOffsets] = (0, import_element.useState)({});
  const [blockRefs, setBlockRefs] = (0, import_element.useState)({});
  const { setCanvasMinHeight, selectNote } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_store.store)
  );
  const { selectBlock, toggleBlockSpotlight } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_block_editor.store)
  );
  const { blockCommentId, selectedBlockClientId, orderedBlockIds } = (0, import_data.useSelect)((select) => {
    const {
      getBlockAttributes,
      getSelectedBlockClientId,
      getClientIdsWithDescendants
    } = select(import_block_editor.store);
    const clientId = getSelectedBlockClientId();
    return {
      blockCommentId: clientId ? getBlockAttributes(clientId)?.metadata?.noteId : null,
      selectedBlockClientId: clientId,
      orderedBlockIds: getClientIdsWithDescendants()
    };
  }, []);
  const { selectedNote, noteFocused } = (0, import_data.useSelect)((select) => {
    const { getSelectedNote, isNoteFocused } = (0, import_lock_unlock.unlock)(
      select(import_store.store)
    );
    return {
      selectedNote: getSelectedNote(),
      noteFocused: isNoteFocused()
    };
  }, []);
  const relatedBlockElement = useBlockElement(selectedBlockClientId);
  const threads = (0, import_element.useMemo)(() => {
    const t = [...noteThreads];
    const orderedThreads = [];
    if (isFloating && selectedNote === "new") {
      const newNoteThread = {
        id: "new",
        blockClientId: selectedBlockClientId,
        content: { rendered: "" }
      };
      orderedBlockIds.forEach((blockId) => {
        if (blockId === selectedBlockClientId) {
          orderedThreads.push(newNoteThread);
        } else {
          const threadForBlock = t.find(
            (thread) => thread.blockClientId === blockId
          );
          if (threadForBlock) {
            orderedThreads.push(threadForBlock);
          }
        }
      });
      return orderedThreads;
    }
    return t;
  }, [
    noteThreads,
    isFloating,
    selectedNote,
    selectedBlockClientId,
    orderedBlockIds
  ]);
  const handleDelete = async (comment) => {
    const currentIndex = threads.findIndex((t) => t.id === comment.id);
    const nextThread = threads[currentIndex + 1];
    const prevThread = threads[currentIndex - 1];
    await onCommentDelete(comment);
    if (comment.parent !== 0) {
      selectNote(comment.parent);
      (0, import_utils.focusCommentThread)(comment.parent, commentSidebarRef.current);
      return;
    }
    if (nextThread) {
      selectNote(nextThread.id);
      (0, import_utils.focusCommentThread)(nextThread.id, commentSidebarRef.current);
    } else if (prevThread) {
      selectNote(prevThread.id);
      (0, import_utils.focusCommentThread)(prevThread.id, commentSidebarRef.current);
    } else {
      selectNote(void 0);
      toggleBlockSpotlight(comment.blockClientId, false);
      relatedBlockElement?.focus();
    }
  };
  (0, import_element.useEffect)(() => {
    selectNote(blockCommentId ?? void 0);
  }, [blockCommentId, selectNote]);
  (0, import_element.useEffect)(() => {
    if (noteFocused && selectedNote) {
      (0, import_utils.focusCommentThread)(
        selectedNote,
        commentSidebarRef.current,
        selectedNote === "new" ? "textarea" : void 0
      );
      selectNote(selectedNote);
    }
  }, [noteFocused, selectedNote, selectNote, commentSidebarRef]);
  (0, import_element.useEffect)(() => {
    const calculateAllOffsets = () => {
      const offsets = {};
      if (!isFloating) {
        return { offsets, minHeight: 0 };
      }
      const selectedThreadIndex = threads.findIndex(
        (t) => t.id === selectedNote
      );
      const breakIndex = selectedThreadIndex === -1 ? 0 : selectedThreadIndex;
      const selectedThreadData = threads[breakIndex];
      if (!selectedThreadData || !blockRefs[selectedThreadData.id]) {
        return { offsets, minHeight: 0 };
      }
      let blockElement = blockRefs[selectedThreadData.id];
      let blockRect = blockElement?.getBoundingClientRect();
      const selectedThreadTop = blockRect?.top || 0;
      const selectedThreadHeight = heights[selectedThreadData.id] || 0;
      offsets[selectedThreadData.id] = -16;
      let previousThreadData = {
        threadTop: selectedThreadTop - 16,
        threadHeight: selectedThreadHeight
      };
      for (let i = breakIndex + 1; i < threads.length; i++) {
        const thread = threads[i];
        if (!blockRefs[thread.id]) {
          continue;
        }
        blockElement = blockRefs[thread.id];
        blockRect = blockElement?.getBoundingClientRect();
        const threadTop = blockRect?.top || 0;
        const threadHeight = heights[thread.id] || 0;
        let additionalOffset = -16;
        const previousBottom = previousThreadData.threadTop + previousThreadData.threadHeight;
        if (threadTop < previousBottom + 16) {
          additionalOffset = previousBottom - threadTop + 20;
        }
        offsets[thread.id] = additionalOffset;
        previousThreadData = {
          threadTop: threadTop + additionalOffset,
          threadHeight
        };
      }
      let nextThreadData = {
        threadTop: selectedThreadTop - 16
      };
      for (let i = selectedThreadIndex - 1; i >= 0; i--) {
        const thread = threads[i];
        if (!blockRefs[thread.id]) {
          continue;
        }
        blockElement = blockRefs[thread.id];
        blockRect = blockElement?.getBoundingClientRect();
        const threadTop = blockRect?.top || 0;
        const threadHeight = heights[thread.id] || 0;
        let additionalOffset = -16;
        const threadBottom = threadTop + threadHeight;
        if (threadBottom > nextThreadData.threadTop) {
          additionalOffset = nextThreadData.threadTop - threadTop - threadHeight - 20;
        }
        offsets[thread.id] = additionalOffset;
        nextThreadData = {
          threadTop: threadTop + additionalOffset
        };
      }
      let editorMinHeight = 0;
      const lastThread = threads[threads.length - 1];
      if (blockRefs[lastThread.id]) {
        const lastBlockElement = blockRefs[lastThread.id];
        const lastBlockRect = lastBlockElement?.getBoundingClientRect();
        const lastThreadTop = lastBlockRect?.top || 0;
        const lastThreadHeight = heights[lastThread.id] || 0;
        const lastThreadOffset = offsets[lastThread.id] || 0;
        editorMinHeight = lastThreadTop + lastThreadHeight + lastThreadOffset + 32;
      }
      return { offsets, minHeight: editorMinHeight };
    };
    const { offsets: newOffsets, minHeight } = calculateAllOffsets();
    if (Object.keys(newOffsets).length > 0) {
      setBoardOffsets(newOffsets);
    }
    setCanvasMinHeight(minHeight);
  }, [
    heights,
    blockRefs,
    isFloating,
    threads,
    selectedNote,
    setCanvasMinHeight
  ]);
  const handleThreadNavigation = (event, thread, isSelected) => {
    if (event.defaultPrevented) {
      return;
    }
    const currentIndex = threads.findIndex((t) => t.id === thread.id);
    if ((event.key === "Enter" || event.key === "ArrowRight") && event.currentTarget === event.target && !isSelected) {
      selectNote(thread.id);
      if (!!thread.blockClientId) {
        selectBlock(thread.blockClientId, null);
        toggleBlockSpotlight(thread.blockClientId, true);
      }
    } else if ((event.key === "Enter" || event.key === "ArrowLeft") && event.currentTarget === event.target && isSelected || event.key === "Escape") {
      selectNote(void 0);
      if (thread.blockClientId) {
        toggleBlockSpotlight(thread.blockClientId, false);
      }
      (0, import_utils.focusCommentThread)(thread.id, commentSidebarRef.current);
    } else if (event.key === "ArrowDown" && currentIndex < threads.length - 1 && event.currentTarget === event.target) {
      const nextThread = threads[currentIndex + 1];
      (0, import_utils.focusCommentThread)(nextThread.id, commentSidebarRef.current);
    } else if (event.key === "ArrowUp" && currentIndex > 0 && event.currentTarget === event.target) {
      const prevThread = threads[currentIndex - 1];
      (0, import_utils.focusCommentThread)(prevThread.id, commentSidebarRef.current);
    } else if (event.key === "Home" && event.currentTarget === event.target) {
      (0, import_utils.focusCommentThread)(threads[0].id, commentSidebarRef.current);
    } else if (event.key === "End" && event.currentTarget === event.target) {
      (0, import_utils.focusCommentThread)(
        threads[threads.length - 1].id,
        commentSidebarRef.current
      );
    }
  };
  const setBlockRef = (0, import_element.useCallback)((id, blockRef) => {
    setBlockRefs((prev) => ({ ...prev, [id]: blockRef }));
  }, []);
  const hasThreads = Array.isArray(threads) && threads.length > 0;
  if (!hasThreads && !isFloating) {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_add_comment.AddComment,
      {
        onSubmit: onAddReply,
        commentSidebarRef
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    !isFloating && selectedNote === "new" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_add_comment.AddComment,
      {
        onSubmit: onAddReply,
        commentSidebarRef
      }
    ),
    threads.map((thread) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      Thread,
      {
        thread,
        onAddReply,
        onCommentDelete: handleDelete,
        onEditComment,
        isSelected: selectedNote === thread.id,
        commentSidebarRef,
        reflowComments,
        isFloating,
        calculatedOffset: boardOffsets[thread.id] ?? 0,
        setHeights,
        setBlockRef,
        commentLastUpdated,
        onKeyDown: (event) => handleThreadNavigation(
          event,
          thread,
          selectedNote === thread.id
        )
      },
      thread.id
    ))
  ] });
}
function Thread({
  thread,
  onEditComment,
  onAddReply,
  onCommentDelete,
  isSelected,
  commentSidebarRef,
  reflowComments,
  isFloating,
  calculatedOffset,
  setHeights,
  setBlockRef,
  commentLastUpdated,
  onKeyDown
}) {
  const { toggleBlockHighlight, selectBlock, toggleBlockSpotlight } = (0, import_lock_unlock.unlock)(
    (0, import_data.useDispatch)(import_block_editor.store)
  );
  const { selectNote } = (0, import_lock_unlock.unlock)((0, import_data.useDispatch)(import_store.store));
  const selectedNote = (0, import_data.useSelect)(
    (select) => (0, import_lock_unlock.unlock)(select(import_store.store)).getSelectedNote(),
    []
  );
  const relatedBlockElement = useBlockElement(thread.blockClientId);
  const debouncedToggleBlockHighlight = (0, import_compose.useDebounce)(
    toggleBlockHighlight,
    50
  );
  const { y, refs } = (0, import_hooks.useFloatingThread)({
    thread,
    calculatedOffset,
    setHeights,
    setBlockRef,
    selectedThread: selectedNote,
    commentLastUpdated
  });
  const isKeyboardTabbingRef = (0, import_element.useRef)(false);
  const onMouseEnter = () => {
    debouncedToggleBlockHighlight(thread.blockClientId, true);
  };
  const onMouseLeave = () => {
    debouncedToggleBlockHighlight(thread.blockClientId, false);
  };
  const onFocus = () => {
    toggleBlockHighlight(thread.blockClientId, true);
  };
  const onBlur = (event) => {
    if (!document.hasFocus()) {
      return;
    }
    const isNoteFocused = event.relatedTarget?.closest(
      ".editor-collab-sidebar-panel__thread"
    );
    const isDialogFocused = event.relatedTarget?.closest('[role="dialog"]');
    const isTabbing = isKeyboardTabbingRef.current;
    if (isNoteFocused && !isTabbing) {
      return;
    }
    if (isDialogFocused) {
      return;
    }
    if (isTabbing && event.currentTarget.contains(event.relatedTarget)) {
      return;
    }
    toggleBlockHighlight(thread.blockClientId, false);
    unselectThread();
  };
  const handleCommentSelect = () => {
    selectNote(thread.id);
    toggleBlockSpotlight(thread.blockClientId, true);
    if (!!thread.blockClientId) {
      selectBlock(thread.blockClientId, null);
    }
  };
  const unselectThread = () => {
    selectNote(void 0);
    toggleBlockSpotlight(thread.blockClientId, false);
  };
  const allReplies = thread?.reply || [];
  const lastReply = allReplies.length > 0 ? allReplies[allReplies.length - 1] : void 0;
  const restReplies = allReplies.length > 0 ? allReplies.slice(0, -1) : [];
  const commentExcerpt = (0, import_utils.getCommentExcerpt)(
    (0, import_dom.__unstableStripHTML)(thread.content?.rendered),
    10
  );
  const ariaLabel = !!thread.blockClientId ? (0, import_i18n.sprintf)(
    // translators: %s: note excerpt
    (0, import_i18n.__)("Note: %s"),
    commentExcerpt
  ) : (0, import_i18n.sprintf)(
    // translators: %s: note excerpt
    (0, import_i18n.__)("Original block deleted. Note: %s"),
    commentExcerpt
  );
  if (isFloating && thread.id === "new") {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      import_add_comment.AddComment,
      {
        onSubmit: onAddReply,
        commentSidebarRef,
        reflowComments,
        isFloating,
        y,
        refs
      }
    );
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalVStack,
    {
      className: (0, import_clsx.default)("editor-collab-sidebar-panel__thread", {
        "is-selected": isSelected,
        "is-floating": isFloating
      }),
      id: `comment-thread-${thread.id}`,
      spacing: "3",
      onClick: handleCommentSelect,
      onMouseEnter,
      onMouseLeave,
      onFocus,
      onBlur,
      onKeyUp: (event) => {
        if (event.key === "Tab") {
          isKeyboardTabbingRef.current = false;
        }
      },
      onKeyDown: (event) => {
        if (event.key === "Tab") {
          isKeyboardTabbingRef.current = true;
        } else {
          onKeyDown(event);
        }
      },
      tabIndex: 0,
      role: "treeitem",
      "aria-label": ariaLabel,
      "aria-expanded": isSelected,
      ref: isFloating ? refs.setFloating : void 0,
      style: isFloating ? { top: y } : void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            className: "editor-collab-sidebar-panel__skip-to-comment",
            variant: "secondary",
            size: "compact",
            onClick: () => {
              (0, import_utils.focusCommentThread)(
                thread.id,
                commentSidebarRef.current,
                "textarea"
              );
            },
            children: (0, import_i18n.__)("Add new reply")
          }
        ),
        !thread.blockClientId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalText, { as: "p", weight: 500, variant: "muted", children: (0, import_i18n.__)("Original block deleted.") }),
        /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          CommentBoard,
          {
            thread,
            isExpanded: isSelected,
            onEdit: (params = {}) => {
              onEditComment(params);
              if (params.status === "approved") {
                unselectThread();
                if (isFloating) {
                  relatedBlockElement?.focus();
                } else {
                  (0, import_utils.focusCommentThread)(
                    thread.id,
                    commentSidebarRef.current
                  );
                }
              }
            },
            onDelete: onCommentDelete,
            reflowComments
          }
        ),
        isSelected && allReplies.map((reply) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          CommentBoard,
          {
            thread: reply,
            parent: thread,
            isExpanded: isSelected,
            onEdit: onEditComment,
            onDelete: onCommentDelete,
            reflowComments
          },
          reply.id
        )),
        !isSelected && restReplies.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalHStack, { className: "editor-collab-sidebar-panel__more-reply-separator", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            size: "compact",
            variant: "tertiary",
            className: "editor-collab-sidebar-panel__more-reply-button",
            onClick: () => {
              selectNote(thread.id);
              (0, import_utils.focusCommentThread)(
                thread.id,
                commentSidebarRef.current
              );
            },
            children: (0, import_i18n.sprintf)(
              // translators: %s: number of replies.
              (0, import_i18n._n)(
                "%s more reply",
                "%s more replies",
                restReplies.length
              ),
              restReplies.length
            )
          }
        ) }),
        !isSelected && lastReply && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          CommentBoard,
          {
            thread: lastReply,
            parent: thread,
            isExpanded: isSelected,
            onEdit: onEditComment,
            onDelete: onCommentDelete,
            reflowComments
          }
        ),
        isSelected && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalVStack, { spacing: "2", role: "treeitem", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalHStack, { alignment: "left", spacing: "3", justify: "flex-start", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_comment_author_info.default, {}) }),
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_components.__experimentalVStack, { spacing: "2", children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_comment_form.default,
            {
              onSubmit: (inputComment) => {
                if ("approved" === thread.status) {
                  onEditComment({
                    id: thread.id,
                    status: "hold",
                    content: inputComment
                  });
                } else {
                  onAddReply({
                    content: inputComment,
                    parent: thread.id
                  });
                }
              },
              onCancel: (event) => {
                event.stopPropagation();
                unselectThread();
                (0, import_utils.focusCommentThread)(
                  thread.id,
                  commentSidebarRef.current
                );
              },
              submitButtonText: "approved" === thread.status ? (0, import_i18n.__)("Reopen & Reply") : (0, import_i18n.__)("Reply"),
              rows: "approved" === thread.status ? 2 : 4,
              labelText: (0, import_i18n.sprintf)(
                // translators: %1$s: note identifier, %2$s: author name
                (0, import_i18n.__)("Reply to note %1$s by %2$s"),
                thread.id,
                thread.author_name
              ),
              reflowComments
            }
          ) })
        ] }),
        !!thread.blockClientId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.Button,
          {
            className: "editor-collab-sidebar-panel__skip-to-block",
            variant: "secondary",
            size: "compact",
            onClick: (event) => {
              event.stopPropagation();
              relatedBlockElement?.focus();
            },
            children: (0, import_i18n.__)("Back to block")
          }
        )
      ]
    }
  );
}
var CommentBoard = ({
  thread,
  parent,
  isExpanded,
  onEdit,
  onDelete,
  reflowComments
}) => {
  const [actionState, setActionState] = (0, import_element.useState)(false);
  const [showConfirmDialog, setShowConfirmDialog] = (0, import_element.useState)(false);
  const actionButtonRef = (0, import_element.useRef)(null);
  const handleConfirmDelete = () => {
    onDelete(thread);
    setActionState(false);
    setShowConfirmDialog(false);
  };
  const handleCancel = () => {
    setActionState(false);
    setShowConfirmDialog(false);
    actionButtonRef.current?.focus();
  };
  const isResolutionComment = thread.type === "note" && thread.meta && (thread.meta._wp_note_status === "resolved" || thread.meta._wp_note_status === "reopen");
  const actions = [
    {
      id: "edit",
      title: (0, import_i18n.__)("Edit"),
      isEligible: ({ status }) => status !== "approved",
      onClick: () => {
        setActionState("edit");
      }
    },
    {
      id: "reopen",
      title: (0, import_i18n._x)("Reopen", "Reopen note"),
      isEligible: ({ status }) => status === "approved",
      onClick: () => {
        onEdit({ id: thread.id, status: "hold" });
      }
    },
    {
      id: "delete",
      title: (0, import_i18n.__)("Delete"),
      isEligible: () => true,
      onClick: () => {
        setActionState("delete");
        setShowConfirmDialog(true);
      }
    }
  ];
  const canResolve = thread.parent === 0;
  const moreActions = parent?.status !== "approved" ? actions.filter((item) => item.isEligible(thread)) : [];
  const deleteConfirmMessage = (
    // When deleting a top level note, descendants will also be deleted.
    thread.parent === 0 ? (0, import_i18n.__)(
      "Are you sure you want to delete this note? This will also delete all of this note's replies."
    ) : (0, import_i18n.__)("Are you sure you want to delete this reply?")
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
    import_components.__experimentalVStack,
    {
      spacing: "2",
      role: thread.parent !== 0 ? "treeitem" : void 0,
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { alignment: "left", spacing: "3", justify: "flex-start", children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_comment_author_info.default,
            {
              avatar: thread?.author_avatar_urls?.[48],
              name: thread?.author_name,
              date: thread?.date,
              userId: thread?.author
            }
          ),
          isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
            import_components.FlexItem,
            {
              className: "editor-collab-sidebar-panel__comment-status",
              onClick: (event) => {
                event.stopPropagation();
              },
              children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_components.__experimentalHStack, { spacing: "0", children: [
                canResolve && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                  import_components.Button,
                  {
                    label: (0, import_i18n._x)(
                      "Resolve",
                      "Mark note as resolved"
                    ),
                    size: "small",
                    icon: import_icons.published,
                    disabled: thread.status === "approved",
                    accessibleWhenDisabled: thread.status === "approved",
                    onClick: () => {
                      onEdit({
                        id: thread.id,
                        status: "approved"
                      });
                    }
                  }
                ),
                /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Menu, { placement: "bottom-end", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Menu.TriggerButton,
                    {
                      render: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        import_components.Button,
                        {
                          ref: actionButtonRef,
                          size: "small",
                          icon: import_icons.moreVertical,
                          label: (0, import_i18n.__)("Actions"),
                          disabled: !moreActions.length,
                          accessibleWhenDisabled: true
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                    Menu.Popover,
                    {
                      modal: false,
                      children: moreActions.map((action) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
                        Menu.Item,
                        {
                          onClick: () => action.onClick(),
                          children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu.ItemLabel, { children: action.title })
                        },
                        action.id
                      ))
                    }
                  )
                ] })
              ] })
            }
          )
        ] }),
        "edit" === actionState ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_comment_form.default,
          {
            onSubmit: (value) => {
              onEdit({
                id: thread.id,
                content: value
              });
              setActionState(false);
              actionButtonRef.current?.focus();
            },
            onCancel: () => handleCancel(),
            thread,
            submitButtonText: (0, import_i18n._x)("Update", "verb"),
            labelText: (0, import_i18n.sprintf)(
              // translators: %1$s: note identifier, %2$s: author name.
              (0, import_i18n.__)("Edit note %1$s by %2$s"),
              thread.id,
              thread.author_name
            ),
            reflowComments
          }
        ) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_element.RawHTML,
          {
            className: (0, import_clsx.default)(
              "editor-collab-sidebar-panel__user-comment",
              {
                "editor-collab-sidebar-panel__resolution-text": isResolutionComment
              }
            ),
            children: isResolutionComment ? (() => {
              const actionText = thread.meta._wp_note_status === "resolved" ? (0, import_i18n.__)("Marked as resolved") : (0, import_i18n.__)("Reopened");
              const content = thread?.content?.raw;
              if (content && typeof content === "string" && content.trim() !== "") {
                return (0, import_i18n.sprintf)(
                  // translators: %1$s: action label ("Marked as resolved" or "Reopened"); %2$s: note text.
                  (0, import_i18n.__)("%1$s: %2$s"),
                  actionText,
                  content
                );
              }
              return actionText;
            })() : thread?.content?.rendered
          }
        ),
        "delete" === actionState && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
          import_components.__experimentalConfirmDialog,
          {
            isOpen: showConfirmDialog,
            onConfirm: handleConfirmDelete,
            onCancel: handleCancel,
            confirmButtonText: (0, import_i18n.__)("Delete"),
            children: deleteConfirmMessage
          }
        )
      ]
    }
  );
};
var comments_default = Comments;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Comments
});
//# sourceMappingURL=comments.cjs.map
