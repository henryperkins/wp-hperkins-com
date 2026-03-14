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

// packages/edit-post/src/hooks/use-navigate-to-entity-record.js
var use_navigate_to_entity_record_exports = {};
__export(use_navigate_to_entity_record_exports, {
  default: () => useNavigateToEntityRecord
});
module.exports = __toCommonJS(use_navigate_to_entity_record_exports);
var import_element = require("@wordpress/element");
var import_data = require("@wordpress/data");
var import_editor = require("@wordpress/editor");
var import_core_data = require("@wordpress/core-data");
function useNavigateToEntityRecord(initialPostId, initialPostType, defaultRenderingMode) {
  const registry = (0, import_data.useRegistry)();
  const [postHistory, dispatch] = (0, import_element.useReducer)(
    (historyState, { type, post: post2, previousRenderingMode: previousRenderingMode2, selectedBlockClientId }) => {
      if (type === "push") {
        const updatedHistory = [...historyState];
        const currentIndex = updatedHistory.length - 1;
        updatedHistory[currentIndex] = {
          ...updatedHistory[currentIndex],
          selectedBlockClientId
        };
        return [...updatedHistory, { post: post2, previousRenderingMode: previousRenderingMode2 }];
      }
      if (type === "pop") {
        if (historyState.length > 1) {
          return historyState.slice(0, -1);
        }
      }
      return historyState;
    },
    [
      {
        post: { postId: initialPostId, postType: initialPostType }
      }
    ]
  );
  const { post, previousRenderingMode } = postHistory[postHistory.length - 1];
  const { getRenderingMode } = (0, import_data.useSelect)(import_editor.store);
  const { setRenderingMode } = (0, import_data.useDispatch)(import_editor.store);
  const { editEntityRecord } = (0, import_data.useDispatch)(import_core_data.store);
  const onNavigateToEntityRecord = (0, import_element.useCallback)(
    (params) => {
      const entityEdits = registry.select(import_core_data.store).getEntityRecordEdits("postType", post.postType, post.postId);
      const externalClientId = entityEdits?.selection?.selectionStart?.clientId ?? null;
      dispatch({
        type: "push",
        post: { postId: params.postId, postType: params.postType },
        // Save the current rendering mode so we can restore it when navigating back.
        previousRenderingMode: getRenderingMode(),
        selectedBlockClientId: externalClientId
      });
      setRenderingMode(defaultRenderingMode);
    },
    [
      registry,
      post.postType,
      post.postId,
      getRenderingMode,
      setRenderingMode,
      defaultRenderingMode
    ]
  );
  const onNavigateToPreviousEntityRecord = (0, import_element.useCallback)(() => {
    if (postHistory.length > 1) {
      const previousItem = postHistory[postHistory.length - 2];
      if (previousItem.selectedBlockClientId) {
        editEntityRecord(
          "postType",
          previousItem.post.postType,
          previousItem.post.postId,
          {
            selection: {
              selectionStart: {
                clientId: previousItem.selectedBlockClientId
              },
              selectionEnd: {
                clientId: previousItem.selectedBlockClientId
              }
            }
          },
          { undoIgnore: true }
        );
      }
    }
    dispatch({
      type: "pop"
    });
    if (previousRenderingMode) {
      setRenderingMode(previousRenderingMode);
    }
  }, [
    setRenderingMode,
    previousRenderingMode,
    postHistory,
    editEntityRecord
  ]);
  return {
    currentPost: post,
    onNavigateToEntityRecord,
    onNavigateToPreviousEntityRecord: postHistory.length > 1 ? onNavigateToPreviousEntityRecord : void 0
  };
}
//# sourceMappingURL=use-navigate-to-entity-record.cjs.map
