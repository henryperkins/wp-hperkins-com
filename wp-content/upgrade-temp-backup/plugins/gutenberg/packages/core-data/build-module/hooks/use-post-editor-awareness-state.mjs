// packages/core-data/src/hooks/use-post-editor-awareness-state.ts
import { useEffect, useState } from "@wordpress/element";
import { getSyncManager } from "../sync.mjs";
var defaultResolvedSelection = {
  textIndex: null,
  localClientId: null
};
var defaultState = {
  activeCollaborators: [],
  resolveSelection: () => defaultResolvedSelection,
  getDebugData: () => ({
    doc: {},
    clients: {},
    collaboratorMap: {}
  }),
  isCurrentCollaboratorDisconnected: false
};
function getAwarenessState(awareness, newState) {
  const activeCollaborators = newState ?? awareness.getCurrentState();
  return {
    activeCollaborators,
    resolveSelection: (selection) => awareness.convertSelectionStateToAbsolute(selection),
    getDebugData: () => awareness.getDebugData(),
    isCurrentCollaboratorDisconnected: activeCollaborators.find((collaborator) => collaborator.isMe)?.isConnected === false
  };
}
function usePostEditorAwarenessState(postId, postType) {
  const [state, setState] = useState(defaultState);
  useEffect(() => {
    if (null === postId || null === postType) {
      setState(defaultState);
      return;
    }
    const objectType = `postType/${postType}`;
    const objectId = postId.toString();
    const awareness = getSyncManager()?.getAwareness(
      objectType,
      objectId
    );
    if (!awareness) {
      setState(defaultState);
      return;
    }
    awareness.setUp();
    setState(getAwarenessState(awareness));
    const unsubscribe = awareness?.onStateChange(
      (newState) => {
        setState(getAwarenessState(awareness, newState));
      }
    );
    return unsubscribe;
  }, [postId, postType]);
  return state;
}
function useActiveCollaborators(postId, postType) {
  return usePostEditorAwarenessState(postId, postType).activeCollaborators;
}
function useResolvedSelection(postId, postType) {
  return usePostEditorAwarenessState(postId, postType).resolveSelection;
}
function useGetDebugData(postId, postType) {
  return usePostEditorAwarenessState(postId, postType).getDebugData();
}
function useIsDisconnected(postId, postType) {
  return usePostEditorAwarenessState(postId, postType).isCurrentCollaboratorDisconnected;
}
function useLastPostSave(postId, postType) {
  const [lastSave, setLastSave] = useState(null);
  useEffect(() => {
    if (null === postId || null === postType) {
      setLastSave(null);
      return;
    }
    const awareness = getSyncManager()?.getAwareness(
      `postType/${postType}`,
      postId.toString()
    );
    if (!awareness) {
      setLastSave(null);
      return;
    }
    awareness.setUp();
    const stateMap = awareness.doc.getMap("state");
    const recordMap = awareness.doc.getMap("document");
    const setupTime = Date.now();
    const observer = (event) => {
      if (event.keysChanged.has("savedAt")) {
        const savedAt = stateMap.get("savedAt");
        const savedByClientId = stateMap.get("savedBy");
        if (typeof savedAt === "number" && typeof savedByClientId === "number" && savedAt > setupTime) {
          const postStatus = recordMap.get("status");
          setLastSave({ savedAt, savedByClientId, postStatus });
        }
      }
    };
    stateMap.observe(observer);
    return () => {
      stateMap.unobserve(observer);
    };
  }, [postId, postType]);
  return lastSave;
}
export {
  useActiveCollaborators,
  useGetDebugData,
  useIsDisconnected,
  useLastPostSave,
  useResolvedSelection
};
//# sourceMappingURL=use-post-editor-awareness-state.mjs.map
