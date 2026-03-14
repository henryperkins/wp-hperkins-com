// packages/editor/src/components/collab-sidebar/hooks.js
import {
  useFloating,
  offset as offsetMiddleware,
  autoUpdate
} from "@floating-ui/react-dom";
import { __ } from "@wordpress/i18n";
import {
  useEffect,
  useMemo,
  useCallback,
  useReducer
} from "@wordpress/element";
import { useEntityRecords, store as coreStore } from "@wordpress/core-data";
import { useDispatch, useRegistry, useSelect } from "@wordpress/data";
import {
  store as blockEditorStore,
  privateApis as blockEditorPrivateApis
} from "@wordpress/block-editor";
import { store as noticesStore } from "@wordpress/notices";
import { decodeEntities } from "@wordpress/html-entities";
import { store as interfaceStore } from "@wordpress/interface";
import { store as editorStore } from "../../store/index.mjs";
import { FLOATING_NOTES_SIDEBAR } from "./constants.mjs";
import { unlock } from "../../lock-unlock.mjs";
import { noop } from "./utils.mjs";
var { useBlockElement, cleanEmptyObject } = unlock(blockEditorPrivateApis);
function useBlockComments(postId) {
  const [commentLastUpdated, reflowComments] = useReducer(
    () => Date.now(),
    0
  );
  const queryArgs = {
    post: postId,
    type: "note",
    status: "all",
    per_page: -1
  };
  const { records: threads } = useEntityRecords(
    "root",
    "comment",
    queryArgs,
    { enabled: !!postId && typeof postId === "number" }
  );
  const { getBlockAttributes } = useSelect(blockEditorStore);
  const { clientIds } = useSelect((select) => {
    const { getClientIdsWithDescendants } = select(blockEditorStore);
    return {
      clientIds: getClientIdsWithDescendants()
    };
  }, []);
  const { resultComments, unresolvedSortedThreads } = useMemo(() => {
    if (!threads || threads.length === 0) {
      return { resultComments: [], unresolvedSortedThreads: [] };
    }
    const blocksWithComments = clientIds.reduce((results, clientId) => {
      const commentId = getBlockAttributes(clientId)?.metadata?.noteId;
      if (commentId) {
        results[clientId] = commentId;
      }
      return results;
    }, {});
    const compare = {};
    const result = [];
    const commentIdToBlockClientId = Object.keys(
      blocksWithComments
    ).reduce((mapping, clientId) => {
      mapping[blocksWithComments[clientId]] = clientId;
      return mapping;
    }, {});
    threads.forEach((item) => {
      const itemBlock = commentIdToBlockClientId[item.id];
      compare[item.id] = {
        ...item,
        reply: [],
        blockClientId: item.parent === 0 ? itemBlock : null
      };
    });
    threads.forEach((item) => {
      if (item.parent === 0) {
        result.push(compare[item.id]);
      } else if (compare[item.parent]) {
        compare[item.parent].reply.push(compare[item.id]);
      }
    });
    if (0 === result?.length) {
      return { resultComments: [], unresolvedSortedThreads: [] };
    }
    const updatedResult = result.map((item) => ({
      ...item,
      reply: [...item.reply].reverse()
    }));
    const threadIdMap = new Map(
      updatedResult.map((thread) => [String(thread.id), thread])
    );
    const mappedIds = new Set(
      Object.values(blocksWithComments).map((id) => String(id))
    );
    const unresolvedSortedComments = Object.values(blocksWithComments).map((commentId) => threadIdMap.get(String(commentId))).filter(
      (thread) => thread !== void 0 && thread.status === "hold"
    );
    const resolvedSortedComments = Object.values(blocksWithComments).map((commentId) => threadIdMap.get(String(commentId))).filter(
      (thread) => thread !== void 0 && thread.status === "approved"
    );
    const orphanedComments = updatedResult.filter(
      (thread) => !mappedIds.has(String(thread.id))
    );
    const allSortedComments = [
      ...unresolvedSortedComments,
      ...resolvedSortedComments,
      ...orphanedComments
    ];
    return {
      resultComments: allSortedComments,
      unresolvedSortedThreads: unresolvedSortedComments
    };
  }, [clientIds, threads, getBlockAttributes]);
  return {
    resultComments,
    unresolvedSortedThreads,
    reflowComments,
    commentLastUpdated
  };
}
function useBlockCommentsActions(reflowComments = noop) {
  const { createNotice } = useDispatch(noticesStore);
  const { saveEntityRecord, deleteEntityRecord } = useDispatch(coreStore);
  const { getCurrentPostId } = useSelect(editorStore);
  const { getBlockAttributes, getSelectedBlockClientId } = useSelect(blockEditorStore);
  const { updateBlockAttributes } = useDispatch(blockEditorStore);
  const onError = (error) => {
    const errorMessage = error.message && error.code !== "unknown_error" ? decodeEntities(error.message) : __("An error occurred while performing an update.");
    createNotice("error", errorMessage, {
      type: "snackbar",
      isDismissible: true
    });
  };
  const onCreate = async ({ content, parent }) => {
    try {
      const savedRecord = await saveEntityRecord(
        "root",
        "comment",
        {
          post: getCurrentPostId(),
          content,
          status: "hold",
          type: "note",
          parent: parent || 0
        },
        { throwOnError: true }
      );
      if (!parent && savedRecord?.id) {
        const clientId = getSelectedBlockClientId();
        const metadata = getBlockAttributes(clientId)?.metadata;
        updateBlockAttributes(clientId, {
          metadata: {
            ...metadata,
            noteId: savedRecord.id
          }
        });
      }
      createNotice(
        "snackbar",
        parent ? __("Reply added.") : __("Note added."),
        {
          type: "snackbar",
          isDismissible: true
        }
      );
      setTimeout(reflowComments, 300);
      return savedRecord;
    } catch (error) {
      reflowComments();
      onError(error);
    }
  };
  const onEdit = async ({ id, content, status }) => {
    const messageType = status ? status : "updated";
    const messages = {
      approved: __("Note marked as resolved."),
      hold: __("Note reopened."),
      updated: __("Note updated.")
    };
    try {
      if (status === "approved" || status === "hold") {
        await saveEntityRecord(
          "root",
          "comment",
          {
            id,
            status
          },
          {
            throwOnError: true
          }
        );
        const newCommentData = {
          post: getCurrentPostId(),
          content: content || "",
          // Empty content for resolve, content for reopen.
          type: "note",
          status,
          parent: id,
          meta: {
            _wp_note_status: status === "approved" ? "resolved" : "reopen"
          }
        };
        await saveEntityRecord("root", "comment", newCommentData, {
          throwOnError: true
        });
      } else {
        const updateData = {
          id,
          content,
          status
        };
        await saveEntityRecord("root", "comment", updateData, {
          throwOnError: true
        });
      }
      createNotice(
        "snackbar",
        messages[messageType] ?? __("Note updated."),
        {
          type: "snackbar",
          isDismissible: true
        }
      );
      reflowComments();
    } catch (error) {
      reflowComments();
      onError(error);
    }
  };
  const onDelete = async (comment) => {
    try {
      await deleteEntityRecord(
        "root",
        "comment",
        comment.id,
        void 0,
        {
          throwOnError: true
        }
      );
      if (!comment.parent) {
        const clientId = getSelectedBlockClientId();
        const metadata = getBlockAttributes(clientId)?.metadata;
        updateBlockAttributes(clientId, {
          metadata: cleanEmptyObject({
            ...metadata,
            noteId: void 0
          })
        });
      }
      createNotice("snackbar", __("Note deleted."), {
        type: "snackbar",
        isDismissible: true
      });
      reflowComments();
    } catch (error) {
      reflowComments();
      onError(error);
    }
  };
  return { onCreate, onEdit, onDelete };
}
function useEnableFloatingSidebar(enabled = false) {
  const registry = useRegistry();
  useEffect(() => {
    if (!enabled) {
      return;
    }
    const { getActiveComplementaryArea } = registry.select(interfaceStore);
    const { disableComplementaryArea, enableComplementaryArea } = registry.dispatch(interfaceStore);
    const unsubscribe = registry.subscribe(() => {
      if (getActiveComplementaryArea("core") === null) {
        enableComplementaryArea("core", FLOATING_NOTES_SIDEBAR);
      }
    });
    return () => {
      unsubscribe();
      if (getActiveComplementaryArea("core") === FLOATING_NOTES_SIDEBAR) {
        disableComplementaryArea("core", FLOATING_NOTES_SIDEBAR);
      }
    };
  }, [enabled, registry]);
}
function useFloatingThread({
  thread,
  calculatedOffset,
  setHeights,
  selectedThread,
  setBlockRef,
  commentLastUpdated
}) {
  const blockElement = useBlockElement(thread.blockClientId);
  const updateHeight = useCallback(
    (id, newHeight) => {
      setHeights((prev) => {
        if (prev[id] !== newHeight) {
          return { ...prev, [id]: newHeight };
        }
        return prev;
      });
    },
    [setHeights]
  );
  const { y, refs } = useFloating({
    placement: "right-start",
    middleware: [
      offsetMiddleware({
        crossAxis: calculatedOffset || -16
      })
    ],
    whileElementsMounted: autoUpdate
  });
  useEffect(() => {
    if (blockElement) {
      refs.setReference(blockElement);
    }
  }, [blockElement, refs, commentLastUpdated]);
  useEffect(() => {
    if (refs.floating?.current) {
      setBlockRef(thread.id, blockElement);
    }
  }, [blockElement, thread.id, refs.floating, setBlockRef]);
  useEffect(() => {
    if (refs.floating?.current) {
      const newHeight = refs.floating.current.scrollHeight;
      updateHeight(thread.id, newHeight);
    }
  }, [
    thread.id,
    updateHeight,
    refs.floating,
    selectedThread,
    commentLastUpdated
  ]);
  return {
    y,
    refs
  };
}
export {
  useBlockComments,
  useBlockCommentsActions,
  useEnableFloatingSidebar,
  useFloatingThread
};
//# sourceMappingURL=hooks.mjs.map
