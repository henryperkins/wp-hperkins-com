"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/editor/src/components/collab-sidebar/hooks.js
var hooks_exports = {};
__export(hooks_exports, {
  useBlockComments: () => useBlockComments,
  useBlockCommentsActions: () => useBlockCommentsActions,
  useEnableFloatingSidebar: () => useEnableFloatingSidebar,
  useFloatingThread: () => useFloatingThread
});
module.exports = __toCommonJS(hooks_exports);
var import_react_dom = require("@floating-ui/react-dom");
var import_i18n = require("@wordpress/i18n");
var import_element = require("@wordpress/element");
var import_core_data = require("@wordpress/core-data");
var import_data = require("@wordpress/data");
var import_block_editor = require("@wordpress/block-editor");
var import_notices = require("@wordpress/notices");
var import_html_entities = require("@wordpress/html-entities");
var import_interface = require("@wordpress/interface");
var import_store = require("../../store/index.cjs");
var import_constants = require("./constants.cjs");
var import_lock_unlock = require("../../lock-unlock.cjs");
var import_utils = require("./utils.cjs");
var { useBlockElement, cleanEmptyObject } = (0, import_lock_unlock.unlock)(import_block_editor.privateApis);
function useBlockComments(postId) {
  const [commentLastUpdated, reflowComments] = (0, import_element.useReducer)(
    () => Date.now(),
    0
  );
  const queryArgs = {
    post: postId,
    type: "note",
    status: "all",
    per_page: -1
  };
  const { records: threads } = (0, import_core_data.useEntityRecords)(
    "root",
    "comment",
    queryArgs,
    { enabled: !!postId && typeof postId === "number" }
  );
  const { getBlockAttributes } = (0, import_data.useSelect)(import_block_editor.store);
  const { clientIds } = (0, import_data.useSelect)((select) => {
    const { getClientIdsWithDescendants } = select(import_block_editor.store);
    return {
      clientIds: getClientIdsWithDescendants()
    };
  }, []);
  const { resultComments, unresolvedSortedThreads } = (0, import_element.useMemo)(() => {
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
function useBlockCommentsActions(reflowComments = import_utils.noop) {
  const { createNotice } = (0, import_data.useDispatch)(import_notices.store);
  const { saveEntityRecord, deleteEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const { getCurrentPostId } = (0, import_data.useSelect)(import_store.store);
  const { getBlockAttributes, getSelectedBlockClientId } = (0, import_data.useSelect)(import_block_editor.store);
  const { updateBlockAttributes } = (0, import_data.useDispatch)(import_block_editor.store);
  const onError = (error) => {
    const errorMessage = error.message && error.code !== "unknown_error" ? (0, import_html_entities.decodeEntities)(error.message) : (0, import_i18n.__)("An error occurred while performing an update.");
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
        parent ? (0, import_i18n.__)("Reply added.") : (0, import_i18n.__)("Note added."),
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
      approved: (0, import_i18n.__)("Note marked as resolved."),
      hold: (0, import_i18n.__)("Note reopened."),
      updated: (0, import_i18n.__)("Note updated.")
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
        messages[messageType] ?? (0, import_i18n.__)("Note updated."),
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
      createNotice("snackbar", (0, import_i18n.__)("Note deleted."), {
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
  const registry = (0, import_data.useRegistry)();
  (0, import_element.useEffect)(() => {
    if (!enabled) {
      return;
    }
    const { getActiveComplementaryArea } = registry.select(import_interface.store);
    const { disableComplementaryArea, enableComplementaryArea } = registry.dispatch(import_interface.store);
    const unsubscribe = registry.subscribe(() => {
      if (getActiveComplementaryArea("core") === null) {
        enableComplementaryArea("core", import_constants.FLOATING_NOTES_SIDEBAR);
      }
    });
    return () => {
      unsubscribe();
      if (getActiveComplementaryArea("core") === import_constants.FLOATING_NOTES_SIDEBAR) {
        disableComplementaryArea("core", import_constants.FLOATING_NOTES_SIDEBAR);
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
  const updateHeight = (0, import_element.useCallback)(
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
  const { y, refs } = (0, import_react_dom.useFloating)({
    placement: "right-start",
    middleware: [
      (0, import_react_dom.offset)({
        crossAxis: calculatedOffset || -16
      })
    ],
    whileElementsMounted: import_react_dom.autoUpdate
  });
  (0, import_element.useEffect)(() => {
    if (blockElement) {
      refs.setReference(blockElement);
    }
  }, [blockElement, refs, commentLastUpdated]);
  (0, import_element.useEffect)(() => {
    if (refs.floating?.current) {
      setBlockRef(thread.id, blockElement);
    }
  }, [blockElement, thread.id, refs.floating, setBlockRef]);
  (0, import_element.useEffect)(() => {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useBlockComments,
  useBlockCommentsActions,
  useEnableFloatingSidebar,
  useFloatingThread
});
//# sourceMappingURL=hooks.cjs.map
