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

// packages/editor/src/components/local-autosave-monitor/index.js
var local_autosave_monitor_exports = {};
__export(local_autosave_monitor_exports, {
  default: () => local_autosave_monitor_default
});
module.exports = __toCommonJS(local_autosave_monitor_exports);
var import_element = require("@wordpress/element");
var import_compose = require("@wordpress/compose");
var import_data = require("@wordpress/data");
var import_i18n = require("@wordpress/i18n");
var import_blocks = require("@wordpress/blocks");
var import_notices = require("@wordpress/notices");
var import_autosave_monitor = __toESM(require("../autosave-monitor/index.cjs"));
var import_local_autosave = require("../../store/local-autosave.cjs");
var import_store = require("../../store/index.cjs");
var import_jsx_runtime = require("react/jsx-runtime");
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
  const { postId, isEditedPostNew, hasRemoteAutosave } = (0, import_data.useSelect)(
    (select) => ({
      postId: select(import_store.store).getCurrentPostId(),
      isEditedPostNew: select(import_store.store).isEditedPostNew(),
      hasRemoteAutosave: !!select(import_store.store).getEditorSettings().autosave
    }),
    []
  );
  const { getEditedPostAttribute } = (0, import_data.useSelect)(import_store.store);
  const { createWarningNotice, removeNotice } = (0, import_data.useDispatch)(import_notices.store);
  const { editPost, resetEditorBlocks } = (0, import_data.useDispatch)(import_store.store);
  (0, import_element.useEffect)(() => {
    let localAutosave = (0, import_local_autosave.localAutosaveGet)(postId, isEditedPostNew);
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
        (0, import_local_autosave.localAutosaveClear)(postId, isEditedPostNew);
        return;
      }
    }
    if (hasRemoteAutosave) {
      return;
    }
    const id = "wpEditorAutosaveRestore";
    createWarningNotice(
      (0, import_i18n.__)(
        "The backup of this post in your browser is different from the version below."
      ),
      {
        id,
        actions: [
          {
            label: (0, import_i18n.__)("Restore the backup"),
            onClick() {
              const {
                content: editsContent,
                ...editsWithoutContent
              } = edits;
              editPost(editsWithoutContent);
              resetEditorBlocks((0, import_blocks.parse)(edits.content));
              removeNotice(id);
            }
          }
        ]
      }
    );
  }, [isEditedPostNew, postId]);
}
function useAutosavePurge() {
  const { postId, isEditedPostNew, isDirty, isAutosaving, didError } = (0, import_data.useSelect)(
    (select) => ({
      postId: select(import_store.store).getCurrentPostId(),
      isEditedPostNew: select(import_store.store).isEditedPostNew(),
      isDirty: select(import_store.store).isEditedPostDirty(),
      isAutosaving: select(import_store.store).isAutosavingPost(),
      didError: select(import_store.store).didPostSaveRequestFail()
    }),
    []
  );
  const lastIsDirtyRef = (0, import_element.useRef)(isDirty);
  const lastIsAutosavingRef = (0, import_element.useRef)(isAutosaving);
  (0, import_element.useEffect)(() => {
    if (!didError && (lastIsAutosavingRef.current && !isAutosaving || lastIsDirtyRef.current && !isDirty)) {
      (0, import_local_autosave.localAutosaveClear)(postId, isEditedPostNew);
    }
    lastIsDirtyRef.current = isDirty;
    lastIsAutosavingRef.current = isAutosaving;
  }, [isDirty, isAutosaving, didError]);
  const wasEditedPostNew = (0, import_compose.usePrevious)(isEditedPostNew);
  const prevPostId = (0, import_compose.usePrevious)(postId);
  (0, import_element.useEffect)(() => {
    if (prevPostId === postId && wasEditedPostNew && !isEditedPostNew) {
      (0, import_local_autosave.localAutosaveClear)(postId, true);
    }
  }, [isEditedPostNew, postId]);
}
function LocalAutosaveMonitor() {
  const { autosave } = (0, import_data.useDispatch)(import_store.store);
  const deferredAutosave = (0, import_element.useCallback)(() => {
    requestIdleCallback(() => autosave({ local: true }));
  }, []);
  useAutosaveNotice();
  useAutosavePurge();
  const localAutosaveInterval = (0, import_data.useSelect)(
    (select) => select(import_store.store).getEditorSettings().localAutosaveInterval,
    []
  );
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    import_autosave_monitor.default,
    {
      interval: localAutosaveInterval,
      autosave: deferredAutosave
    }
  );
}
var local_autosave_monitor_default = (0, import_compose.ifCondition)(hasSessionStorageSupport)(LocalAutosaveMonitor);
//# sourceMappingURL=index.cjs.map
