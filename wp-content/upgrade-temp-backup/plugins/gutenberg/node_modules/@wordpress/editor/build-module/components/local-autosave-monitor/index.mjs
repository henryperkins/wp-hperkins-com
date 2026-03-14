// packages/editor/src/components/local-autosave-monitor/index.js
import { useCallback, useEffect, useRef } from "@wordpress/element";
import { ifCondition, usePrevious } from "@wordpress/compose";
import { useSelect, useDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { parse } from "@wordpress/blocks";
import { store as noticesStore } from "@wordpress/notices";
import AutosaveMonitor from "../autosave-monitor/index.mjs";
import {
  localAutosaveGet,
  localAutosaveClear
} from "../../store/local-autosave.mjs";
import { store as editorStore } from "../../store/index.mjs";
import { jsx } from "react/jsx-runtime";
var requestIdleCallback = window.requestIdleCallback ? window.requestIdleCallback : window.requestAnimationFrame;
var hasStorageSupport;
var hasSessionStorageSupport = () => {
  if (hasStorageSupport !== void 0) {
    return hasStorageSupport;
  }
  try {
    window.sessionStorage.setItem("__wpEditorTestSessionStorage", "");
    window.sessionStorage.removeItem("__wpEditorTestSessionStorage");
    hasStorageSupport = true;
  } catch {
    hasStorageSupport = false;
  }
  return hasStorageSupport;
};
function useAutosaveNotice() {
  const { postId, isEditedPostNew, hasRemoteAutosave } = useSelect(
    (select) => ({
      postId: select(editorStore).getCurrentPostId(),
      isEditedPostNew: select(editorStore).isEditedPostNew(),
      hasRemoteAutosave: !!select(editorStore).getEditorSettings().autosave
    }),
    []
  );
  const { getEditedPostAttribute } = useSelect(editorStore);
  const { createWarningNotice, removeNotice } = useDispatch(noticesStore);
  const { editPost, resetEditorBlocks } = useDispatch(editorStore);
  useEffect(() => {
    let localAutosave = localAutosaveGet(postId, isEditedPostNew);
    if (!localAutosave) {
      return;
    }
    try {
      localAutosave = JSON.parse(localAutosave);
    } catch {
      return;
    }
    const { post_title: title, content, excerpt } = localAutosave;
    const edits = { title, content, excerpt };
    {
      const hasDifference = Object.keys(edits).some((key) => {
        return edits[key] !== getEditedPostAttribute(key);
      });
      if (!hasDifference) {
        localAutosaveClear(postId, isEditedPostNew);
        return;
      }
    }
    if (hasRemoteAutosave) {
      return;
    }
    const id = "wpEditorAutosaveRestore";
    createWarningNotice(
      __(
        "The backup of this post in your browser is different from the version below."
      ),
      {
        id,
        actions: [
          {
            label: __("Restore the backup"),
            onClick() {
              const {
                content: editsContent,
                ...editsWithoutContent
              } = edits;
              editPost(editsWithoutContent);
              resetEditorBlocks(parse(edits.content));
              removeNotice(id);
            }
          }
        ]
      }
    );
  }, [isEditedPostNew, postId]);
}
function useAutosavePurge() {
  const { postId, isEditedPostNew, isDirty, isAutosaving, didError } = useSelect(
    (select) => ({
      postId: select(editorStore).getCurrentPostId(),
      isEditedPostNew: select(editorStore).isEditedPostNew(),
      isDirty: select(editorStore).isEditedPostDirty(),
      isAutosaving: select(editorStore).isAutosavingPost(),
      didError: select(editorStore).didPostSaveRequestFail()
    }),
    []
  );
  const lastIsDirtyRef = useRef(isDirty);
  const lastIsAutosavingRef = useRef(isAutosaving);
  useEffect(() => {
    if (!didError && (lastIsAutosavingRef.current && !isAutosaving || lastIsDirtyRef.current && !isDirty)) {
      localAutosaveClear(postId, isEditedPostNew);
    }
    lastIsDirtyRef.current = isDirty;
    lastIsAutosavingRef.current = isAutosaving;
  }, [isDirty, isAutosaving, didError]);
  const wasEditedPostNew = usePrevious(isEditedPostNew);
  const prevPostId = usePrevious(postId);
  useEffect(() => {
    if (prevPostId === postId && wasEditedPostNew && !isEditedPostNew) {
      localAutosaveClear(postId, true);
    }
  }, [isEditedPostNew, postId]);
}
function LocalAutosaveMonitor() {
  const { autosave } = useDispatch(editorStore);
  const deferredAutosave = useCallback(() => {
    requestIdleCallback(() => autosave({ local: true }));
  }, []);
  useAutosaveNotice();
  useAutosavePurge();
  const localAutosaveInterval = useSelect(
    (select) => select(editorStore).getEditorSettings().localAutosaveInterval,
    []
  );
  return /* @__PURE__ */ jsx(
    AutosaveMonitor,
    {
      interval: localAutosaveInterval,
      autosave: deferredAutosave
    }
  );
}
var local_autosave_monitor_default = ifCondition(hasSessionStorageSupport)(LocalAutosaveMonitor);
export {
  local_autosave_monitor_default as default
};
//# sourceMappingURL=index.mjs.map
