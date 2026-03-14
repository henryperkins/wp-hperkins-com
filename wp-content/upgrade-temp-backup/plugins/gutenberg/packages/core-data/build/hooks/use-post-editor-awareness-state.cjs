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

// packages/core-data/src/hooks/use-post-editor-awareness-state.ts
var use_post_editor_awareness_state_exports = {};
__export(use_post_editor_awareness_state_exports, {
  useActiveCollaborators: () => useActiveCollaborators,
  useGetDebugData: () => useGetDebugData,
  useIsDisconnected: () => useIsDisconnected,
  useLastPostSave: () => useLastPostSave,
  useResolvedSelection: () => useResolvedSelection
});
module.exports = __toCommonJS(use_post_editor_awareness_state_exports);
var import_element = require("@wordpress/element");
var import_sync = require("../sync.cjs");
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
  const [state, setState] = (0, import_element.useState)(defaultState);
  (0, import_element.useEffect)(() => {
    if (null === postId || null === postType) {
      setState(defaultState);
      return;
    }
    const objectType = `postType/${postType}`;
    const objectId = postId.toString();
    const awareness = (0, import_sync.getSyncManager)()?.getAwareness(
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
  const [lastSave, setLastSave] = (0, import_element.useState)(null);
  (0, import_element.useEffect)(() => {
    if (null === postId || null === postType) {
      setLastSave(null);
      return;
    }
    const awareness = (0, import_sync.getSyncManager)()?.getAwareness(
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useActiveCollaborators,
  useGetDebugData,
  useIsDisconnected,
  useLastPostSave,
  useResolvedSelection
});
//# sourceMappingURL=use-post-editor-awareness-state.cjs.map
