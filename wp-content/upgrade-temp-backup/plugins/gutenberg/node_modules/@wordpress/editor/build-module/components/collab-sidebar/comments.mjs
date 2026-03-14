// packages/editor/src/components/collab-sidebar/comments.js
import clsx from "clsx";
import {
  useState,
  RawHTML,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from "@wordpress/element";
import {
  __experimentalText as Text,
  __experimentalHStack as HStack,
  __experimentalVStack as VStack,
  __experimentalConfirmDialog as ConfirmDialog,
  Button,
  FlexItem,
  privateApis as componentsPrivateApis
} from "@wordpress/components";
import { useDebounce } from "@wordpress/compose";
import { published, moreVertical } from "@wordpress/icons";
import { __, _x, sprintf, _n } from "@wordpress/i18n";
import { useSelect, useDispatch } from "@wordpress/data";
import { __unstableStripHTML as stripHTML } from "@wordpress/dom";
import {
  store as blockEditorStore,
  privateApis as blockEditorPrivateApis
} from "@wordpress/block-editor";
import { unlock } from "../../lock-unlock.mjs";
import CommentAuthorInfo from "./comment-author-info.mjs";
import CommentForm from "./comment-form.mjs";
import { focusCommentThread, getCommentExcerpt } from "./utils.mjs";
import { useFloatingThread } from "./hooks.mjs";
import { AddComment } from "./add-comment.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var { useBlockElement } = unlock(blockEditorPrivateApis);
var { Menu } = unlock(componentsPrivateApis);
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
  const [heights, setHeights] = useState({});
  const [boardOffsets, setBoardOffsets] = useState({});
  const [blockRefs, setBlockRefs] = useState({});
  const { setCanvasMinHeight, selectNote } = unlock(
    useDispatch(editorStore)
  );
  const { selectBlock, toggleBlockSpotlight } = unlock(
    useDispatch(blockEditorStore)
  );
  const { blockCommentId, selectedBlockClientId, orderedBlockIds } = useSelect((select) => {
    const {
      getBlockAttributes,
      getSelectedBlockClientId,
      getClientIdsWithDescendants
    } = select(blockEditorStore);
    const clientId = getSelectedBlockClientId();
    return {
      blockCommentId: clientId ? getBlockAttributes(clientId)?.metadata?.noteId : null,
      selectedBlockClientId: clientId,
      orderedBlockIds: getClientIdsWithDescendants()
    };
  }, []);
  const { selectedNote, noteFocused } = useSelect((select) => {
    const { getSelectedNote, isNoteFocused } = unlock(
      select(editorStore)
    );
    return {
      selectedNote: getSelectedNote(),
      noteFocused: isNoteFocused()
    };
  }, []);
  const relatedBlockElement = useBlockElement(selectedBlockClientId);
  const threads = useMemo(() => {
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
      focusCommentThread(comment.parent, commentSidebarRef.current);
      return;
    }
    if (nextThread) {
      selectNote(nextThread.id);
      focusCommentThread(nextThread.id, commentSidebarRef.current);
    } else if (prevThread) {
      selectNote(prevThread.id);
      focusCommentThread(prevThread.id, commentSidebarRef.current);
    } else {
      selectNote(void 0);
      toggleBlockSpotlight(comment.blockClientId, false);
      relatedBlockElement?.focus();
    }
  };
  useEffect(() => {
    selectNote(blockCommentId ?? void 0);
  }, [blockCommentId, selectNote]);
  useEffect(() => {
    if (noteFocused && selectedNote) {
      focusCommentThread(
        selectedNote,
        commentSidebarRef.current,
        selectedNote === "new" ? "textarea" : void 0
      );
      selectNote(selectedNote);
    }
  }, [noteFocused, selectedNote, selectNote, commentSidebarRef]);
  useEffect(() => {
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
      focusCommentThread(thread.id, commentSidebarRef.current);
    } else if (event.key === "ArrowDown" && currentIndex < threads.length - 1 && event.currentTarget === event.target) {
      const nextThread = threads[currentIndex + 1];
      focusCommentThread(nextThread.id, commentSidebarRef.current);
    } else if (event.key === "ArrowUp" && currentIndex > 0 && event.currentTarget === event.target) {
      const prevThread = threads[currentIndex - 1];
      focusCommentThread(prevThread.id, commentSidebarRef.current);
    } else if (event.key === "Home" && event.currentTarget === event.target) {
      focusCommentThread(threads[0].id, commentSidebarRef.current);
    } else if (event.key === "End" && event.currentTarget === event.target) {
      focusCommentThread(
        threads[threads.length - 1].id,
        commentSidebarRef.current
      );
    }
  };
  const setBlockRef = useCallback((id, blockRef) => {
    setBlockRefs((prev) => ({ ...prev, [id]: blockRef }));
  }, []);
  const hasThreads = Array.isArray(threads) && threads.length > 0;
  if (!hasThreads && !isFloating) {
    return /* @__PURE__ */ jsx(
      AddComment,
      {
        onSubmit: onAddReply,
        commentSidebarRef
      }
    );
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !isFloating && selectedNote === "new" && /* @__PURE__ */ jsx(
      AddComment,
      {
        onSubmit: onAddReply,
        commentSidebarRef
      }
    ),
    threads.map((thread) => /* @__PURE__ */ jsx(
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
  const { toggleBlockHighlight, selectBlock, toggleBlockSpotlight } = unlock(
    useDispatch(blockEditorStore)
  );
  const { selectNote } = unlock(useDispatch(editorStore));
  const selectedNote = useSelect(
    (select) => unlock(select(editorStore)).getSelectedNote(),
    []
  );
  const relatedBlockElement = useBlockElement(thread.blockClientId);
  const debouncedToggleBlockHighlight = useDebounce(
    toggleBlockHighlight,
    50
  );
  const { y, refs } = useFloatingThread({
    thread,
    calculatedOffset,
    setHeights,
    setBlockRef,
    selectedThread: selectedNote,
    commentLastUpdated
  });
  const isKeyboardTabbingRef = useRef(false);
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
  const commentExcerpt = getCommentExcerpt(
    stripHTML(thread.content?.rendered),
    10
  );
  const ariaLabel = !!thread.blockClientId ? sprintf(
    // translators: %s: note excerpt
    __("Note: %s"),
    commentExcerpt
  ) : sprintf(
    // translators: %s: note excerpt
    __("Original block deleted. Note: %s"),
    commentExcerpt
  );
  if (isFloating && thread.id === "new") {
    return /* @__PURE__ */ jsx(
      AddComment,
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
  return /* @__PURE__ */ jsxs(
    VStack,
    {
      className: clsx("editor-collab-sidebar-panel__thread", {
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
        /* @__PURE__ */ jsx(
          Button,
          {
            className: "editor-collab-sidebar-panel__skip-to-comment",
            variant: "secondary",
            size: "compact",
            onClick: () => {
              focusCommentThread(
                thread.id,
                commentSidebarRef.current,
                "textarea"
              );
            },
            children: __("Add new reply")
          }
        ),
        !thread.blockClientId && /* @__PURE__ */ jsx(Text, { as: "p", weight: 500, variant: "muted", children: __("Original block deleted.") }),
        /* @__PURE__ */ jsx(
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
                  focusCommentThread(
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
        isSelected && allReplies.map((reply) => /* @__PURE__ */ jsx(
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
        !isSelected && restReplies.length > 0 && /* @__PURE__ */ jsx(HStack, { className: "editor-collab-sidebar-panel__more-reply-separator", children: /* @__PURE__ */ jsx(
          Button,
          {
            size: "compact",
            variant: "tertiary",
            className: "editor-collab-sidebar-panel__more-reply-button",
            onClick: () => {
              selectNote(thread.id);
              focusCommentThread(
                thread.id,
                commentSidebarRef.current
              );
            },
            children: sprintf(
              // translators: %s: number of replies.
              _n(
                "%s more reply",
                "%s more replies",
                restReplies.length
              ),
              restReplies.length
            )
          }
        ) }),
        !isSelected && lastReply && /* @__PURE__ */ jsx(
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
        isSelected && /* @__PURE__ */ jsxs(VStack, { spacing: "2", role: "treeitem", children: [
          /* @__PURE__ */ jsx(HStack, { alignment: "left", spacing: "3", justify: "flex-start", children: /* @__PURE__ */ jsx(CommentAuthorInfo, {}) }),
          /* @__PURE__ */ jsx(VStack, { spacing: "2", children: /* @__PURE__ */ jsx(
            CommentForm,
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
                focusCommentThread(
                  thread.id,
                  commentSidebarRef.current
                );
              },
              submitButtonText: "approved" === thread.status ? __("Reopen & Reply") : __("Reply"),
              rows: "approved" === thread.status ? 2 : 4,
              labelText: sprintf(
                // translators: %1$s: note identifier, %2$s: author name
                __("Reply to note %1$s by %2$s"),
                thread.id,
                thread.author_name
              ),
              reflowComments
            }
          ) })
        ] }),
        !!thread.blockClientId && /* @__PURE__ */ jsx(
          Button,
          {
            className: "editor-collab-sidebar-panel__skip-to-block",
            variant: "secondary",
            size: "compact",
            onClick: (event) => {
              event.stopPropagation();
              relatedBlockElement?.focus();
            },
            children: __("Back to block")
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
  const [actionState, setActionState] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const actionButtonRef = useRef(null);
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
      title: __("Edit"),
      isEligible: ({ status }) => status !== "approved",
      onClick: () => {
        setActionState("edit");
      }
    },
    {
      id: "reopen",
      title: _x("Reopen", "Reopen note"),
      isEligible: ({ status }) => status === "approved",
      onClick: () => {
        onEdit({ id: thread.id, status: "hold" });
      }
    },
    {
      id: "delete",
      title: __("Delete"),
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
    thread.parent === 0 ? __(
      "Are you sure you want to delete this note? This will also delete all of this note's replies."
    ) : __("Are you sure you want to delete this reply?")
  );
  return /* @__PURE__ */ jsxs(
    VStack,
    {
      spacing: "2",
      role: thread.parent !== 0 ? "treeitem" : void 0,
      children: [
        /* @__PURE__ */ jsxs(HStack, { alignment: "left", spacing: "3", justify: "flex-start", children: [
          /* @__PURE__ */ jsx(
            CommentAuthorInfo,
            {
              avatar: thread?.author_avatar_urls?.[48],
              name: thread?.author_name,
              date: thread?.date,
              userId: thread?.author
            }
          ),
          isExpanded && /* @__PURE__ */ jsx(
            FlexItem,
            {
              className: "editor-collab-sidebar-panel__comment-status",
              onClick: (event) => {
                event.stopPropagation();
              },
              children: /* @__PURE__ */ jsxs(HStack, { spacing: "0", children: [
                canResolve && /* @__PURE__ */ jsx(
                  Button,
                  {
                    label: _x(
                      "Resolve",
                      "Mark note as resolved"
                    ),
                    size: "small",
                    icon: published,
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
                /* @__PURE__ */ jsxs(Menu, { placement: "bottom-end", children: [
                  /* @__PURE__ */ jsx(
                    Menu.TriggerButton,
                    {
                      render: /* @__PURE__ */ jsx(
                        Button,
                        {
                          ref: actionButtonRef,
                          size: "small",
                          icon: moreVertical,
                          label: __("Actions"),
                          disabled: !moreActions.length,
                          accessibleWhenDisabled: true
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    Menu.Popover,
                    {
                      modal: false,
                      children: moreActions.map((action) => /* @__PURE__ */ jsx(
                        Menu.Item,
                        {
                          onClick: () => action.onClick(),
                          children: /* @__PURE__ */ jsx(Menu.ItemLabel, { children: action.title })
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
        "edit" === actionState ? /* @__PURE__ */ jsx(
          CommentForm,
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
            submitButtonText: _x("Update", "verb"),
            labelText: sprintf(
              // translators: %1$s: note identifier, %2$s: author name.
              __("Edit note %1$s by %2$s"),
              thread.id,
              thread.author_name
            ),
            reflowComments
          }
        ) : /* @__PURE__ */ jsx(
          RawHTML,
          {
            className: clsx(
              "editor-collab-sidebar-panel__user-comment",
              {
                "editor-collab-sidebar-panel__resolution-text": isResolutionComment
              }
            ),
            children: isResolutionComment ? (() => {
              const actionText = thread.meta._wp_note_status === "resolved" ? __("Marked as resolved") : __("Reopened");
              const content = thread?.content?.raw;
              if (content && typeof content === "string" && content.trim() !== "") {
                return sprintf(
                  // translators: %1$s: action label ("Marked as resolved" or "Reopened"); %2$s: note text.
                  __("%1$s: %2$s"),
                  actionText,
                  content
                );
              }
              return actionText;
            })() : thread?.content?.rendered
          }
        ),
        "delete" === actionState && /* @__PURE__ */ jsx(
          ConfirmDialog,
          {
            isOpen: showConfirmDialog,
            onConfirm: handleConfirmDelete,
            onCancel: handleCancel,
            confirmButtonText: __("Delete"),
            children: deleteConfirmMessage
          }
        )
      ]
    }
  );
};
var comments_default = Comments;
export {
  Comments,
  comments_default as default
};
//# sourceMappingURL=comments.mjs.map
