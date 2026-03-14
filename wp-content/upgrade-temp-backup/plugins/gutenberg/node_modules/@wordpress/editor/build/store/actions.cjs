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

// packages/editor/src/store/actions.js
var actions_exports = {};
__export(actions_exports, {
  __experimentalTearDownEditor: () => __experimentalTearDownEditor,
  __unstableSaveForPreview: () => __unstableSaveForPreview,
  autosave: () => autosave,
  clearSelectedBlock: () => clearSelectedBlock,
  closePublishSidebar: () => closePublishSidebar,
  createUndoLevel: () => createUndoLevel,
  disablePublishSidebar: () => disablePublishSidebar,
  editPost: () => editPost,
  enablePublishSidebar: () => enablePublishSidebar,
  enterFormattedText: () => enterFormattedText,
  exitFormattedText: () => exitFormattedText,
  hideInsertionPoint: () => hideInsertionPoint,
  insertBlock: () => insertBlock,
  insertBlocks: () => insertBlocks,
  insertDefaultBlock: () => insertDefaultBlock,
  lockPostAutosaving: () => lockPostAutosaving,
  lockPostSaving: () => lockPostSaving,
  mergeBlocks: () => mergeBlocks,
  moveBlockToPosition: () => moveBlockToPosition,
  moveBlocksDown: () => moveBlocksDown,
  moveBlocksUp: () => moveBlocksUp,
  multiSelect: () => multiSelect,
  openPublishSidebar: () => openPublishSidebar,
  receiveBlocks: () => receiveBlocks,
  redo: () => redo,
  refreshPost: () => refreshPost,
  removeBlock: () => removeBlock,
  removeBlocks: () => removeBlocks,
  removeEditorPanel: () => removeEditorPanel,
  replaceBlock: () => replaceBlock,
  replaceBlocks: () => replaceBlocks,
  resetBlocks: () => resetBlocks,
  resetEditorBlocks: () => resetEditorBlocks,
  resetPost: () => resetPost,
  savePost: () => savePost,
  selectBlock: () => selectBlock,
  setDeviceType: () => setDeviceType,
  setEditedPost: () => setEditedPost,
  setIsInserterOpened: () => setIsInserterOpened,
  setIsListViewOpened: () => setIsListViewOpened,
  setRenderingMode: () => setRenderingMode,
  setTemplateValidity: () => setTemplateValidity,
  setupEditor: () => setupEditor,
  setupEditorState: () => setupEditorState,
  showInsertionPoint: () => showInsertionPoint,
  startMultiSelect: () => startMultiSelect,
  startTyping: () => startTyping,
  stopMultiSelect: () => stopMultiSelect,
  stopTyping: () => stopTyping,
  switchEditorMode: () => switchEditorMode,
  synchronizeTemplate: () => synchronizeTemplate,
  toggleBlockMode: () => toggleBlockMode,
  toggleDistractionFree: () => toggleDistractionFree,
  toggleEditorPanelEnabled: () => toggleEditorPanelEnabled,
  toggleEditorPanelOpened: () => toggleEditorPanelOpened,
  togglePublishSidebar: () => togglePublishSidebar,
  toggleSelection: () => toggleSelection,
  toggleSpotlightMode: () => toggleSpotlightMode,
  toggleTopToolbar: () => toggleTopToolbar,
  trashPost: () => trashPost,
  undo: () => undo,
  unlockPostAutosaving: () => unlockPostAutosaving,
  unlockPostSaving: () => unlockPostSaving,
  updateBlock: () => updateBlock,
  updateBlockAttributes: () => updateBlockAttributes,
  updateBlockListSettings: () => updateBlockListSettings,
  updateEditorSettings: () => updateEditorSettings,
  updatePost: () => updatePost,
  updatePostLock: () => updatePostLock
});
module.exports = __toCommonJS(actions_exports);
var import_a11y = require("@wordpress/a11y");
var import_api_fetch = __toESM(require("@wordpress/api-fetch"));
var import_deprecated = __toESM(require("@wordpress/deprecated"));
var import_blocks = require("@wordpress/blocks");
var import_notices = require("@wordpress/notices");
var import_core_data = require("@wordpress/core-data");
var import_block_editor = require("@wordpress/block-editor");
var import_hooks = require("@wordpress/hooks");
var import_preferences = require("@wordpress/preferences");
var import_i18n = require("@wordpress/i18n");
var import_local_autosave = require("./local-autosave.cjs");
var import_notice_builder = require("./utils/notice-builder.cjs");
var import_lock_unlock = require("../lock-unlock.cjs");
var setupEditor = (post, edits, template) => ({ dispatch }) => {
  dispatch.setEditedPost(post.type, post.id);
  const isNewPost = post.status === "auto-draft";
  if (isNewPost && template) {
    let content;
    if ("content" in edits) {
      content = edits.content;
    } else {
      content = post.content.raw;
    }
    let blocks = (0, import_blocks.parse)(content);
    blocks = (0, import_blocks.synchronizeBlocksWithTemplate)(blocks, template);
    dispatch.resetEditorBlocks(blocks, {
      __unstableShouldCreateUndoLevel: false
    });
  }
  if (edits && Object.entries(edits).some(
    ([key, edit]) => edit !== (post[key]?.raw ?? post[key])
  )) {
    dispatch.editPost(edits);
  }
};
function __experimentalTearDownEditor() {
  (0, import_deprecated.default)(
    "wp.data.dispatch( 'core/editor' ).__experimentalTearDownEditor",
    {
      since: "6.5"
    }
  );
  return { type: "DO_NOTHING" };
}
function resetPost() {
  (0, import_deprecated.default)("wp.data.dispatch( 'core/editor' ).resetPost", {
    since: "6.0",
    version: "6.3",
    alternative: "Initialize the editor with the setupEditorState action"
  });
  return { type: "DO_NOTHING" };
}
function updatePost() {
  (0, import_deprecated.default)("wp.data.dispatch( 'core/editor' ).updatePost", {
    since: "5.7",
    alternative: "Use the core entities store instead"
  });
  return {
    type: "DO_NOTHING"
  };
}
function setupEditorState(post) {
  (0, import_deprecated.default)("wp.data.dispatch( 'core/editor' ).setupEditorState", {
    since: "6.5",
    alternative: "wp.data.dispatch( 'core/editor' ).setEditedPost"
  });
  return setEditedPost(post.type, post.id);
}
function setEditedPost(postType, postId) {
  return {
    type: "SET_EDITED_POST",
    postType,
    postId
  };
}
var editPost = (edits, options) => ({ select, registry }) => {
  const { id, type } = select.getCurrentPost();
  registry.dispatch(import_core_data.store).editEntityRecord("postType", type, id, edits, options);
};
var savePost = (options = {}) => async ({ select, dispatch, registry }) => {
  if (!select.isEditedPostSaveable()) {
    return;
  }
  const content = select.getEditedPostContent();
  if (!options.isAutosave) {
    dispatch.editPost({ content }, { undoIgnore: true });
  }
  const previousRecord = select.getCurrentPost();
  let edits = {
    id: previousRecord.id,
    ...registry.select(import_core_data.store).getEntityRecordNonTransientEdits(
      "postType",
      previousRecord.type,
      previousRecord.id
    ),
    content
  };
  dispatch({ type: "REQUEST_POST_UPDATE_START", options });
  let error = false;
  try {
    edits = await (0, import_hooks.applyFiltersAsync)(
      "editor.preSavePost",
      edits,
      options
    );
  } catch (err) {
    error = err;
  }
  if (!error) {
    try {
      await registry.dispatch(import_core_data.store).saveEntityRecord(
        "postType",
        previousRecord.type,
        edits,
        options
      );
    } catch (err) {
      error = err.message && err.code !== "unknown_error" ? err.message : (0, import_i18n.__)("An error occurred while updating.");
    }
  }
  if (!error) {
    error = registry.select(import_core_data.store).getLastEntitySaveError(
      "postType",
      previousRecord.type,
      previousRecord.id
    );
  }
  if (!error) {
    try {
      await (0, import_hooks.applyFilters)(
        "editor.__unstableSavePost",
        Promise.resolve(),
        options
      );
    } catch (err) {
      error = err;
    }
  }
  if (!error) {
    try {
      await (0, import_hooks.doActionAsync)(
        "editor.savePost",
        { id: previousRecord.id, type: previousRecord.type },
        options
      );
    } catch (err) {
      error = err;
    }
  }
  dispatch({ type: "REQUEST_POST_UPDATE_FINISH", options });
  if (typeof window !== "undefined" && window.__experimentalTemplateActivate && !options.isAutosave && previousRecord.type === "wp_template" && (typeof previousRecord.id === "number" || /^\d+$/.test(previousRecord.id))) {
    templateActivationNotice({ select, dispatch, registry });
  }
  if (error) {
    const args = (0, import_notice_builder.getNotificationArgumentsForSaveFail)({
      post: previousRecord,
      edits,
      error
    });
    if (args.length) {
      registry.dispatch(import_notices.store).createErrorNotice(...args);
    }
  } else {
    const updatedRecord = select.getCurrentPost();
    const args = (0, import_notice_builder.getNotificationArgumentsForSaveSuccess)({
      previousPost: previousRecord,
      post: updatedRecord,
      postType: await registry.resolveSelect(import_core_data.store).getPostType(updatedRecord.type),
      options
    });
    if (args.length) {
      registry.dispatch(import_notices.store).createSuccessNotice(...args);
    }
    if (!options.isAutosave) {
      registry.dispatch(import_block_editor.store).__unstableMarkLastChangeAsPersistent();
    }
  }
};
async function templateActivationNotice({ select, registry }) {
  const editorSettings = select.getEditorSettings();
  if (editorSettings.onNavigateToPreviousEntityRecord) {
    return;
  }
  const { id, slug } = select.getCurrentPost();
  const site = await registry.select(import_core_data.store).getEntityRecord("root", "site");
  if (site.active_templates[slug] === id) {
    return;
  }
  const currentTheme = await registry.resolveSelect(import_core_data.store).getCurrentTheme();
  const templateType = currentTheme?.default_template_types.find(
    (type) => type.slug === slug
  );
  await registry.dispatch(import_notices.store).createNotice(
    "info",
    (0, import_i18n.sprintf)(
      // translators: %s: The name (or slug) of the type of template.
      (0, import_i18n.__)('Do you want to activate this "%s" template?'),
      templateType?.title ?? slug
    ),
    {
      id: "template-activate-notice",
      actions: [
        {
          label: (0, import_i18n.__)("Activate"),
          onClick: async () => {
            await registry.dispatch(import_notices.store).createNotice(
              "info",
              (0, import_i18n.__)("Activating template\u2026"),
              { id: "template-activate-notice" }
            );
            try {
              const currentSite = await registry.select(import_core_data.store).getEntityRecord("root", "site");
              await registry.dispatch(import_core_data.store).saveEntityRecord(
                "root",
                "site",
                {
                  active_templates: {
                    ...currentSite.active_templates,
                    [slug]: id
                  }
                },
                { throwOnError: true }
              );
              await registry.dispatch(import_notices.store).createSuccessNotice(
                (0, import_i18n.__)("Template activated."),
                { id: "template-activate-notice" }
              );
            } catch (error) {
              await registry.dispatch(import_notices.store).createErrorNotice(
                (0, import_i18n.__)("Template activation failed."),
                { id: "template-activate-notice" }
              );
              throw error;
            }
          }
        }
      ]
    }
  );
}
function refreshPost() {
  (0, import_deprecated.default)("wp.data.dispatch( 'core/editor' ).refreshPost", {
    since: "6.0",
    version: "6.3",
    alternative: "Use the core entities store instead"
  });
  return { type: "DO_NOTHING" };
}
var trashPost = () => async ({ select, dispatch, registry }) => {
  const postTypeSlug = select.getCurrentPostType();
  const postType = await registry.resolveSelect(import_core_data.store).getPostType(postTypeSlug);
  const { rest_base: restBase, rest_namespace: restNamespace = "wp/v2" } = postType;
  dispatch({ type: "REQUEST_POST_DELETE_START" });
  try {
    const post = select.getCurrentPost();
    await (0, import_api_fetch.default)({
      path: `/${restNamespace}/${restBase}/${post.id}`,
      method: "DELETE"
    });
    await dispatch.savePost();
  } catch (error) {
    registry.dispatch(import_notices.store).createErrorNotice(
      ...(0, import_notice_builder.getNotificationArgumentsForTrashFail)({ error })
    );
  }
  dispatch({ type: "REQUEST_POST_DELETE_FINISH" });
};
var autosave = ({ local = false, ...options } = {}) => async ({ select, dispatch }) => {
  const post = select.getCurrentPost();
  if (local) {
    const isPostNew = select.isEditedPostNew();
    const title = select.getEditedPostAttribute("title");
    const content = select.getEditedPostAttribute("content");
    const excerpt = select.getEditedPostAttribute("excerpt");
    (0, import_local_autosave.localAutosaveSet)(post.id, isPostNew, title, content, excerpt);
  } else {
    await dispatch.savePost({ isAutosave: true, ...options });
  }
};
var __unstableSaveForPreview = ({ forceIsAutosaveable } = {}) => async ({ select, dispatch }) => {
  if ((forceIsAutosaveable || select.isEditedPostAutosaveable()) && !select.isPostLocked()) {
    const isDraft = ["draft", "auto-draft"].includes(
      select.getEditedPostAttribute("status")
    );
    if (isDraft) {
      await dispatch.savePost({ isPreview: true });
    } else {
      await dispatch.autosave({ isPreview: true });
    }
  }
  return select.getEditedPostPreviewLink();
};
var redo = () => ({ registry }) => {
  registry.dispatch(import_core_data.store).redo();
};
var undo = () => ({ registry }) => {
  registry.dispatch(import_core_data.store).undo();
};
function createUndoLevel() {
  (0, import_deprecated.default)("wp.data.dispatch( 'core/editor' ).createUndoLevel", {
    since: "6.0",
    version: "6.3",
    alternative: "Use the core entities store instead"
  });
  return { type: "DO_NOTHING" };
}
function updatePostLock(lock) {
  return {
    type: "UPDATE_POST_LOCK",
    lock
  };
}
var enablePublishSidebar = () => ({ registry }) => {
  registry.dispatch(import_preferences.store).set("core", "isPublishSidebarEnabled", true);
};
var disablePublishSidebar = () => ({ registry }) => {
  registry.dispatch(import_preferences.store).set("core", "isPublishSidebarEnabled", false);
};
function lockPostSaving(lockName) {
  return {
    type: "LOCK_POST_SAVING",
    lockName
  };
}
function unlockPostSaving(lockName) {
  return {
    type: "UNLOCK_POST_SAVING",
    lockName
  };
}
function lockPostAutosaving(lockName) {
  return {
    type: "LOCK_POST_AUTOSAVING",
    lockName
  };
}
function unlockPostAutosaving(lockName) {
  return {
    type: "UNLOCK_POST_AUTOSAVING",
    lockName
  };
}
var resetEditorBlocks = (blocks, options = {}) => ({ select, dispatch, registry }) => {
  const { __unstableShouldCreateUndoLevel, selection } = options;
  const edits = { blocks, selection };
  if (__unstableShouldCreateUndoLevel !== false) {
    const { id, type } = select.getCurrentPost();
    const noChange = registry.select(import_core_data.store).getEditedEntityRecord("postType", type, id).blocks === edits.blocks;
    if (noChange) {
      registry.dispatch(import_core_data.store).__unstableCreateUndoLevel("postType", type, id);
      return;
    }
    edits.content = ({ blocks: blocksForSerialization = [] }) => (0, import_blocks.__unstableSerializeAndClean)(blocksForSerialization);
  }
  dispatch.editPost(edits);
};
function updateEditorSettings(settings) {
  return {
    type: "UPDATE_EDITOR_SETTINGS",
    settings
  };
}
var setRenderingMode = (mode) => ({ dispatch, registry, select }) => {
  if (select.__unstableIsEditorReady() && !select.getEditorSettings().isPreviewMode) {
    registry.dispatch(import_block_editor.store).clearSelectedBlock();
  }
  dispatch({
    type: "SET_RENDERING_MODE",
    mode
  });
};
function setDeviceType(deviceType) {
  return {
    type: "SET_DEVICE_TYPE",
    deviceType
  };
}
var toggleEditorPanelEnabled = (panelName) => ({ registry }) => {
  const inactivePanels = registry.select(import_preferences.store).get("core", "inactivePanels") ?? [];
  const isPanelInactive = !!inactivePanels?.includes(panelName);
  let updatedInactivePanels;
  if (isPanelInactive) {
    updatedInactivePanels = inactivePanels.filter(
      (invactivePanelName) => invactivePanelName !== panelName
    );
  } else {
    updatedInactivePanels = [...inactivePanels, panelName];
  }
  registry.dispatch(import_preferences.store).set("core", "inactivePanels", updatedInactivePanels);
};
var toggleEditorPanelOpened = (panelName) => ({ registry }) => {
  const openPanels = registry.select(import_preferences.store).get("core", "openPanels") ?? [];
  const isPanelOpen = !!openPanels?.includes(panelName);
  let updatedOpenPanels;
  if (isPanelOpen) {
    updatedOpenPanels = openPanels.filter(
      (openPanelName) => openPanelName !== panelName
    );
  } else {
    updatedOpenPanels = [...openPanels, panelName];
  }
  registry.dispatch(import_preferences.store).set("core", "openPanels", updatedOpenPanels);
};
function removeEditorPanel(panelName) {
  return {
    type: "REMOVE_PANEL",
    panelName
  };
}
var setIsInserterOpened = (value) => ({ dispatch, registry }) => {
  if (typeof value === "object" && value.hasOwnProperty("rootClientId") && value.hasOwnProperty("insertionIndex")) {
    (0, import_lock_unlock.unlock)(registry.dispatch(import_block_editor.store)).setInsertionPoint({
      rootClientId: value.rootClientId,
      index: value.insertionIndex
    });
  }
  dispatch({
    type: "SET_IS_INSERTER_OPENED",
    value
  });
};
function setIsListViewOpened(isOpen) {
  return {
    type: "SET_IS_LIST_VIEW_OPENED",
    isOpen
  };
}
var toggleDistractionFree = ({ createNotice = true } = {}) => ({ dispatch, registry }) => {
  const isDistractionFree = registry.select(import_preferences.store).get("core", "distractionFree");
  if (isDistractionFree) {
    registry.dispatch(import_preferences.store).set("core", "fixedToolbar", false);
  }
  if (!isDistractionFree) {
    registry.batch(() => {
      registry.dispatch(import_preferences.store).set("core", "fixedToolbar", true);
      dispatch.setIsInserterOpened(false);
      dispatch.setIsListViewOpened(false);
      (0, import_lock_unlock.unlock)(
        registry.dispatch(import_block_editor.store)
      ).resetZoomLevel();
    });
  }
  registry.batch(() => {
    registry.dispatch(import_preferences.store).set("core", "distractionFree", !isDistractionFree);
    if (createNotice) {
      registry.dispatch(import_notices.store).createInfoNotice(
        isDistractionFree ? (0, import_i18n.__)("Distraction free mode deactivated.") : (0, import_i18n.__)("Distraction free mode activated."),
        {
          id: "core/editor/distraction-free-mode/notice",
          type: "snackbar",
          actions: [
            {
              label: (0, import_i18n.__)("Undo"),
              onClick: () => {
                registry.batch(() => {
                  registry.dispatch(import_preferences.store).set(
                    "core",
                    "fixedToolbar",
                    isDistractionFree
                  );
                  registry.dispatch(import_preferences.store).toggle(
                    "core",
                    "distractionFree"
                  );
                });
              }
            }
          ]
        }
      );
    }
  });
};
var toggleSpotlightMode = () => ({ registry }) => {
  registry.dispatch(import_preferences.store).toggle("core", "focusMode");
  const isFocusMode = registry.select(import_preferences.store).get("core", "focusMode");
  registry.dispatch(import_notices.store).createInfoNotice(
    isFocusMode ? (0, import_i18n.__)("Spotlight mode activated.") : (0, import_i18n.__)("Spotlight mode deactivated."),
    {
      id: "core/editor/toggle-spotlight-mode/notice",
      type: "snackbar",
      actions: [
        {
          label: (0, import_i18n.__)("Undo"),
          onClick: () => {
            registry.dispatch(import_preferences.store).toggle("core", "focusMode");
          }
        }
      ]
    }
  );
};
var toggleTopToolbar = () => ({ registry }) => {
  registry.dispatch(import_preferences.store).toggle("core", "fixedToolbar");
  const isTopToolbar = registry.select(import_preferences.store).get("core", "fixedToolbar");
  registry.dispatch(import_notices.store).createInfoNotice(
    isTopToolbar ? (0, import_i18n.__)("Top toolbar activated.") : (0, import_i18n.__)("Top toolbar deactivated."),
    {
      id: "core/editor/toggle-top-toolbar/notice",
      type: "snackbar",
      actions: [
        {
          label: (0, import_i18n.__)("Undo"),
          onClick: () => {
            registry.dispatch(import_preferences.store).toggle("core", "fixedToolbar");
          }
        }
      ]
    }
  );
};
var switchEditorMode = (mode) => ({ dispatch, registry }) => {
  registry.dispatch(import_preferences.store).set("core", "editorMode", mode);
  if (mode !== "visual") {
    registry.dispatch(import_block_editor.store).clearSelectedBlock();
    (0, import_lock_unlock.unlock)(registry.dispatch(import_block_editor.store)).resetZoomLevel();
  }
  if (mode === "visual") {
    (0, import_a11y.speak)((0, import_i18n.__)("Visual editor selected"), "assertive");
  } else if (mode === "text") {
    const isDistractionFree = registry.select(import_preferences.store).get("core", "distractionFree");
    if (isDistractionFree) {
      dispatch.toggleDistractionFree();
    }
    (0, import_a11y.speak)((0, import_i18n.__)("Code editor selected"), "assertive");
  }
};
function openPublishSidebar() {
  return {
    type: "OPEN_PUBLISH_SIDEBAR"
  };
}
function closePublishSidebar() {
  return {
    type: "CLOSE_PUBLISH_SIDEBAR"
  };
}
function togglePublishSidebar() {
  return {
    type: "TOGGLE_PUBLISH_SIDEBAR"
  };
}
var getBlockEditorAction = (name) => (...args) => ({ registry }) => {
  (0, import_deprecated.default)("`wp.data.dispatch( 'core/editor' )." + name + "`", {
    since: "5.3",
    alternative: "`wp.data.dispatch( 'core/block-editor' )." + name + "`",
    version: "6.2"
  });
  registry.dispatch(import_block_editor.store)[name](...args);
};
var resetBlocks = getBlockEditorAction("resetBlocks");
var receiveBlocks = getBlockEditorAction("receiveBlocks");
var updateBlock = getBlockEditorAction("updateBlock");
var updateBlockAttributes = getBlockEditorAction(
  "updateBlockAttributes"
);
var selectBlock = getBlockEditorAction("selectBlock");
var startMultiSelect = getBlockEditorAction("startMultiSelect");
var stopMultiSelect = getBlockEditorAction("stopMultiSelect");
var multiSelect = getBlockEditorAction("multiSelect");
var clearSelectedBlock = getBlockEditorAction("clearSelectedBlock");
var toggleSelection = getBlockEditorAction("toggleSelection");
var replaceBlocks = getBlockEditorAction("replaceBlocks");
var replaceBlock = getBlockEditorAction("replaceBlock");
var moveBlocksDown = getBlockEditorAction("moveBlocksDown");
var moveBlocksUp = getBlockEditorAction("moveBlocksUp");
var moveBlockToPosition = getBlockEditorAction(
  "moveBlockToPosition"
);
var insertBlock = getBlockEditorAction("insertBlock");
var insertBlocks = getBlockEditorAction("insertBlocks");
var showInsertionPoint = getBlockEditorAction("showInsertionPoint");
var hideInsertionPoint = getBlockEditorAction("hideInsertionPoint");
var setTemplateValidity = getBlockEditorAction(
  "setTemplateValidity"
);
var synchronizeTemplate = getBlockEditorAction(
  "synchronizeTemplate"
);
var mergeBlocks = getBlockEditorAction("mergeBlocks");
var removeBlocks = getBlockEditorAction("removeBlocks");
var removeBlock = getBlockEditorAction("removeBlock");
var toggleBlockMode = getBlockEditorAction("toggleBlockMode");
var startTyping = getBlockEditorAction("startTyping");
var stopTyping = getBlockEditorAction("stopTyping");
var enterFormattedText = getBlockEditorAction("enterFormattedText");
var exitFormattedText = getBlockEditorAction("exitFormattedText");
var insertDefaultBlock = getBlockEditorAction("insertDefaultBlock");
var updateBlockListSettings = getBlockEditorAction(
  "updateBlockListSettings"
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  __experimentalTearDownEditor,
  __unstableSaveForPreview,
  autosave,
  clearSelectedBlock,
  closePublishSidebar,
  createUndoLevel,
  disablePublishSidebar,
  editPost,
  enablePublishSidebar,
  enterFormattedText,
  exitFormattedText,
  hideInsertionPoint,
  insertBlock,
  insertBlocks,
  insertDefaultBlock,
  lockPostAutosaving,
  lockPostSaving,
  mergeBlocks,
  moveBlockToPosition,
  moveBlocksDown,
  moveBlocksUp,
  multiSelect,
  openPublishSidebar,
  receiveBlocks,
  redo,
  refreshPost,
  removeBlock,
  removeBlocks,
  removeEditorPanel,
  replaceBlock,
  replaceBlocks,
  resetBlocks,
  resetEditorBlocks,
  resetPost,
  savePost,
  selectBlock,
  setDeviceType,
  setEditedPost,
  setIsInserterOpened,
  setIsListViewOpened,
  setRenderingMode,
  setTemplateValidity,
  setupEditor,
  setupEditorState,
  showInsertionPoint,
  startMultiSelect,
  startTyping,
  stopMultiSelect,
  stopTyping,
  switchEditorMode,
  synchronizeTemplate,
  toggleBlockMode,
  toggleDistractionFree,
  toggleEditorPanelEnabled,
  toggleEditorPanelOpened,
  togglePublishSidebar,
  toggleSelection,
  toggleSpotlightMode,
  toggleTopToolbar,
  trashPost,
  undo,
  unlockPostAutosaving,
  unlockPostSaving,
  updateBlock,
  updateBlockAttributes,
  updateBlockListSettings,
  updateEditorSettings,
  updatePost,
  updatePostLock
});
//# sourceMappingURL=actions.cjs.map
