// packages/edit-post/src/hooks/use-navigate-to-entity-record.js
import { useCallback, useReducer } from "@wordpress/element";
import { useSelect, useDispatch, useRegistry } from "@wordpress/data";
import { store as editorStore } from "@wordpress/editor";
import { store as coreStore } from "@wordpress/core-data";
function useNavigateToEntityRecord(initialPostId, initialPostType, defaultRenderingMode) {
  const registry = useRegistry();
  const [postHistory, dispatch] = useReducer(
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
  const { getRenderingMode } = useSelect(editorStore);
  const { setRenderingMode } = useDispatch(editorStore);
  const { editEntityRecord } = useDispatch(coreStore);
  const onNavigateToEntityRecord = useCallback(
    (params) => {
      const entityEdits = registry.select(coreStore).getEntityRecordEdits("postType", post.postType, post.postId);
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
  const onNavigateToPreviousEntityRecord = useCallback(() => {
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
export {
  useNavigateToEntityRecord as default
};
//# sourceMappingURL=use-navigate-to-entity-record.mjs.map
